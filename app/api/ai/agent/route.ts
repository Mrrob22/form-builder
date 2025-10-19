import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';

const FieldTypeZ = z.enum(['text','number','textarea','radio','checkbox','select','file','date']);

const OptionZ = z.object({
    value: z.string().min(1),
    label: z.string().min(1),
});

const FieldZ = z.object({
    id: z.string().optional(),
    type: FieldTypeZ,
    name: z.string().min(1),
    label: z.string().min(1),
    placeholder: z.string().optional(),
    required: z.boolean().optional().default(false),
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().positive().optional(),
    rows: z.number().int().min(1).max(20).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    options: z.array(OptionZ).optional(),
    accept: z.string().optional(),
    maxSizeMb: z.number().optional(),
}).strict();

const FieldsArrayZ = z.array(FieldZ).min(1);

const ReqZ = z.object({
    prompt: z.string().min(1),
    mode: z.enum(['add','edit']).optional().default('add'),
    context: z.object({
        fields: z.array(FieldZ.partial()).optional()
    }).optional(),
    field: FieldZ.partial().optional(),
});

const allowedTypes = new Set(['text','number','textarea','radio','checkbox','select','file','date'] as const);

function toKebab(s: string) {
    return s
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .toLowerCase();
}

function ensureUniqueName(base: string, existing?: { name?: string }[]) {
    const used = new Set((existing ?? []).map(f => (f?.name || '').toLowerCase()).filter(Boolean));
    let n = toKebab(base || 'field');
    if (!used.has(n)) return n;
    let i = 2;
    while (used.has(`${n}_${i}`)) i++;
    return `${n}_${i}`;
}

function coerceField(raw: unknown, existing?: { name?: string }[]): z.infer<typeof FieldZ> {
    const parsed = FieldZ.parse(raw);
    const type = String(parsed.type);
    if (!allowedTypes.has(type as any)) {
        throw new Error(`Unsupported field type: ${type}`);
    }
    const id = parsed.id || crypto.randomUUID();
    const name = parsed.name ? ensureUniqueName(parsed.name, existing) : ensureUniqueName(parsed.label || 'field', existing);

    let options = parsed.options;
    if ((type === 'radio' || type === 'select') && (!options || options.length === 0)) {
        options = [{ value: 'option_1', label: 'Опція 1' }, { value: 'option_2', label: 'Опція 2' }];
    }
    if (options && options.length > 50) options = options.slice(0, 50);

    return { ...parsed, id, name, options };
}

function normalizeOutput(json: any, existing?: { name?: string }[]) {
    if (Array.isArray(json)) {
        return FieldsArrayZ.parse(json).map((f) => coerceField(f, existing));
    }
    return [coerceField(json, existing)];
}

const SYSTEM_PROMPT = `
Ти — асистент для побудови форм (Form Builder). 
ПОВЕРТАЙ ТІЛЬКИ JSON без пояснень. Без трі́йних бектіків, без тексту поза JSON.
Формат одного поля:

{
  "type": "text|number|textarea|radio|checkbox|select|file|date",
  "name": "kebab_case_or_snake_case_key",
  "label": "Людська назва",
  "placeholder": "підказка (опціонально)",
  "required": true|false,
  "minLength": 0,
  "maxLength": 255,
  "rows": 5,
  "min": 0,
  "max": 100,
  "step": 1,
  "options": [{ "value": "x", "label": "X" }],   
  "accept": "image/*",                            
  "maxSizeMb": 10                                 
}

— Обери коректний type під запит користувача.
— Для "radio"/"select" ОБОВ'ЯЗКОВО надавай масив "options".
— Значення name повинно бути коротким і придатним для програмного ключа.
— Якщо користувач просить кілька полів, поверни JSON-масив полів.
— НЕ ВИКОРИСТОВУЙ жодного тексту поза JSON.
`;

export async function POST(req: Request) {
    try {
        const { prompt, mode, context, field } = ReqZ.parse(await req.json());

        const llm = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-4o-mini',
            temperature: 0.2,
            maxTokens: 600,
        });

        const existingNames = (context?.fields ?? []).map(f => ({ name: f?.name || '' }));
        const editInfo = mode === 'edit' && field
            ? `\nКористувач хоче ОНОВИТИ наявне поле (ось його поточний JSON):\n${JSON.stringify(field)}\n`
            : '';

        const userMsg = `
Опис користувача:
${prompt}

${editInfo}
Поточні ключі полів у формі (щоб не дублювати "name"): ${JSON.stringify(existingNames.map(n => n.name))}

Нагадування:
- ПОВЕРТАЙ ТІЛЬКИ ВАЛІДНИЙ JSON (одне поле або масив полів).
- Без коментарів, без Markdown, без тексту поза JSON.
`;

        const res = await llm.invoke([
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMsg },
        ]);

        const text = typeof res.content === 'string'
            ? res.content
            : Array.isArray(res.content)
                ? res.content.map((c: any) => c?.text ?? '').join('\n')
                : String(res.content ?? '');

        let parsed: any;
        try {
            parsed = JSON.parse(text);
        } catch {
            const m = text.match(/{[\s\S]*}|\[[\s\S]*]/);
            if (!m) throw new Error('LLM did not return JSON');
            parsed = JSON.parse(m[0]);
        }

        const fields = normalizeOutput(parsed, existingNames);

        const safeFields = fields.map(f => ({
            id: f.id || crypto.randomUUID(),
            type: f.type,
            name: f.name,
            label: f.label,
            placeholder: f.placeholder,
            required: f.required,
            minLength: f.minLength,
            maxLength: f.maxLength,
            rows: f.rows,
            min: f.min,
            max: f.max,
            step: f.step,
            options: f.options,
            accept: f.accept,
            maxSizeMb: f.maxSizeMb,
        }));

        if (mode === 'edit') {
            return NextResponse.json({ field: safeFields[0] });
        }
        return NextResponse.json(safeFields.length === 1 ? { field: safeFields[0] } : { fields: safeFields });
    } catch (err: any) {
        const message = process.env.NODE_ENV === 'development'
            ? (err?.message || 'AI_AGENT_ERROR')
            : 'AI_AGENT_ERROR';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

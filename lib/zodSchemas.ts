import { z } from 'zod';


export const FieldTypeZ = z.enum(['text','number','textarea']);


export const FieldZ = z.object({
    id: z.string(),
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
}).refine((f) => (f.type !== 'textarea' || f.rows !== undefined) ? true : true);


export const FormZ = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    fields: z.array(FieldZ),
    isPublished: z.boolean().optional(),
});


export type FieldDTO = z.infer<typeof FieldZ>;
export type FormDTO = z.infer<typeof FormZ>;
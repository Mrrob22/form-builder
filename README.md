# Form Builder — простий README (uk)

Невелика система **конструктора форм** на **Next.js + GraphQL + MongoDB**.

## 🔧 Стек

* **Next.js 15 (App Router, TypeScript)**
* **MongoDB + Mongoose**
* **GraphQL (Yoga)**
* **Валідація:** Zod
* **UI:** Material UI
* **Аутентифікація:** паролі (bcrypt, власний JWT у cookie `fb_token`) + **Google OAuth (NextAuth)**
* **Лінтинг:** ESLint

---

## ▶️ Швидкий старт

```bash
# 1) Встановити залежності
npm i

# 2) Скопіювати приклад змінних та відредагувати
cp .env.example .env.local

# 3) Запустити dev-сервер
npm run dev
```

Відкрити:

* Публічна частина: `http://localhost:3000/` → список опублікованих форм
* Адмінка: `http://localhost:3000/admin` (потрібна авторизація)

---

## 🔐 Авторизація

* **Логін/реєстрація (email + пароль)**

    * POST `/api/auth/register`
    * POST `/api/auth/login`
    * Видається JWT у cookie `fb_token`.
* **Google OAuth**

    * Маршрути NextAuth: `/api/auth/[...nextauth]`
    * Після колбеку викликається `/api/auth/complete` → ставить `fb_token` і редіректить.

### Налаштування Google OAuth

У **Google Cloud Console → Credentials**:

* **Authorized JavaScript origins:** `http://localhost:3000`
* **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`

У `.env.local` додати:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<довгий випадковий рядок>
```

---

## 🗂️ Змінні середовища (`.env.local`)

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<довгий_секрет_для_JWT>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<довгий_секрет_для_NextAuth>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
OPENAI_API_KEY= # опціонально, для AI-агента
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 🧪 Початкові дані (seed)

Створює/оновлює адміністратора в БД (роль `admin`).

```bash
# один раз встановити раннер
npm i -D tsx

# запустити сид
npm run seed
```

> Логін для admin: email з `ADMIN_EMAIL`, пароль з `ADMIN_PASSWORD`.

---

## 🧠 AI-агент (опційно)

Маршрут `/api/ai/agent` допомагає створювати поля “з тексту” (можна підключити OpenAI/LangChain).
Потрібен `OPENAI_API_KEY` (якщо використовуєш генерацію через OpenAI).

---

## 🧭 Основні сторінки

* `/(public)`:

    * `/` — список опублікованих форм
    * `/forms/[slug]` — заповнення форми + модалка підтвердження
* `/(admin)`:

    * `/admin` — дашборд
    * `/admin/forms` — список форм
    * `/admin/forms/new` — створення
    * `/admin/forms/[id]/edit` — редактор (прев’ю + сайдбар налаштувань)

---

## 🛠️ Скрипти

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "tsx scripts/seed.ts"
  }
}
```

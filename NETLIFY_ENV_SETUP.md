# Настройка переменных окружения

## Локальная разработка (.env.local)

Для локальной разработки создайте файл `.env.local` в корне проекта:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI Provider API Keys (добавьте хотя бы один)
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
GOOGLE_GEMINI_API_KEY=your_google_key
COHERE_API_KEY=your_cohere_key
HUGGING_FACE_API_KEY=your_huggingface_key
GROK_API_KEY=your_grok_key
DEEPSEEK_API_KEY=your_deepseek_key
GITHUB_TOKEN=your_github_token
QWEN_API_KEY=your_qwen_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Database (опционально)
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Stripe (опционально)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# PostHog Analytics (опционально)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Настройка на Netlify

Для корректной работы AI-провайдеров на Netlify необходимо настроить следующие переменные окружения:

### Обязательные переменные

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### AI Provider API Keys (хотя бы один)
```
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
GOOGLE_GEMINI_API_KEY=your_google_key
COHERE_API_KEY=your_cohere_key
HUGGING_FACE_API_KEY=your_huggingface_key
GROK_API_KEY=your_grok_key
DEEPSEEK_API_KEY=your_deepseek_key
GITHUB_TOKEN=your_github_token (для GitHub Models)
QWEN_API_KEY=your_qwen_key (для HuggingFace)
```

#### Application Settings
```
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Опциональные переменные

#### Database (если используется)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

#### Stripe (если используется)
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### PostHog Analytics (если используется)
```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Как добавить переменные на Netlify:

1. Зайдите в панель управления Netlify
2. Выберите ваш сайт
3. Перейдите в Site settings → Environment variables
4. Добавьте каждую переменную через кнопку "Add variable"
5. **Важно**: Убедитесь, что значения точно соответствуют вашим ключам API

## Важные замечания:

- **ОБЯЗАТЕЛЬНО** добавьте хотя бы один API ключ для AI-провайдера
- Убедитесь, что `NEXT_PUBLIC_APP_URL` указывает на ваш Netlify домен
- Для локальной разработки используйте `http://localhost:3000`
- После добавления переменных сделайте новый деплой
- Проверьте логи деплоя на наличие ошибок
- Файл `.env.local` должен быть добавлен в `.gitignore`

## Проверка работы:

### Локально:
1. Создайте файл `.env.local` с необходимыми переменными
2. Запустите `npm run dev`
3. Проверьте работу AI-провайдеров

### На Netlify:
1. Добавьте все переменные в Netlify Dashboard
2. Сделайте новый деплой
3. Проверьте `/api/health` эндпоинт
4. Попробуйте сгенерировать текст через UI

Если проблемы остаются, проверьте логи функций в Netlify Dashboard → Functions.
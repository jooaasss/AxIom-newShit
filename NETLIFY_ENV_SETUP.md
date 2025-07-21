# Настройка переменных окружения на Netlify

Для корректной работы AI-провайдеров на Netlify необходимо настроить следующие переменные окружения:

## Обязательные переменные

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### AI Provider API Keys (хотя бы один)
```
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
GOOGLE_GEMINI_API_KEY=your_google_key
COHERE_API_KEY=your_cohere_key
HUGGING_FACE_API_KEY=your_huggingface_key
GROK_API_KEY=your_grok_key
DEEPSEEK_API_KEY=your_deepseek_key
GITHUB_TOKEN=your_github_token
QWEN_API_KEY=your_qwen_key
```

### Application Settings
```
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Опциональные переменные

### Database (если используется)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Stripe (если используется)
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### PostHog Analytics (если используется)
```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Как добавить переменные на Netlify:

1. Зайдите в панель управления Netlify
2. Выберите ваш сайт
3. Перейдите в Site settings → Environment variables
4. Добавьте каждую переменную через кнопку "Add variable"

## Важные замечания:

- **ОБЯЗАТЕЛЬНО** добавьте хотя бы один API ключ для AI-провайдера
- Убедитесь, что `NEXT_PUBLIC_APP_URL` указывает на ваш Netlify домен
- После добавления переменных сделайте новый деплой
- Проверьте логи деплоя на наличие ошибок

## Проверка работы:

После настройки переменных окружения:
1. Сделайте новый деплой
2. Проверьте `/api/health` эндпоинт
3. Попробуйте сгенерировать текст через UI

Если проблемы остаются, проверьте логи функций в Netlify Dashboard → Functions.
# 🚨 КРИТИЧНА ПОМИЛКА: Неправильний Stripe API ключ на продакшені

## Проблема
На продакшені використовується неправильний Stripe API ключ: `sk_test_***************uild`
Це заглушка для збірки, а не реальний ключ.

## Помилка в логах
```
Invalid API Key provided: sk_test_***************uild
StripeAuthenticationError
```

## ✅ РІШЕННЯ

### 1. Перевірте змінні середовища на продакшені
Використайте ваш реальний Stripe ключ:
```
STRIPE_SECRET_KEY=sk_live_YOUR_REAL_STRIPE_SECRET_KEY_HERE
```

### 2. Налаштування для різних платформ

#### Netlify
1. Зайдіть в Netlify Dashboard
2. Site settings → Environment variables
3. Додайте/оновіть:
   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_REAL_STRIPE_SECRET_KEY_HERE
   ```
4. Redeploy site

#### Vercel
1. Зайдіть в Vercel Dashboard
2. Project Settings → Environment Variables
3. Додайте/оновіть змінну
4. Redeploy

#### Railway/Render/інші
1. Знайдіть розділ Environment Variables
2. Оновіть STRIPE_SECRET_KEY
3. Restart/Redeploy

### 3. Перевірка після виправлення
1. Спробуйте підписатися на Pro план
2. Перевірте логи - не повинно бути помилок про Invalid API Key
3. Переконайтеся, що перенаправлення на Stripe працює

### 4. Додаткові змінні для повної функціональності
```
STRIPE_SECRET_KEY=sk_live_YOUR_REAL_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_REAL_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_REAL_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_реальний_id
NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=price_реальний_id
NEXT_PUBLIC_STRIPE_CREDITS_PRICE_ID=price_реальний_id
```

## 🔍 Діагностика
Тепер код автоматично виявляє неправильні ключі та виводить зрозумілі помилки:
- ❌ STRIPE_SECRET_KEY is not properly configured
- HTTP 503: Payment system is not configured

## ⚠️ ВАЖЛИВО
- Ніколи не комітьте реальні ключі в git
- Використовуйте тільки live ключі на продакшені
- Переконайтеся, що webhook URL налаштований в Stripe Dashboard
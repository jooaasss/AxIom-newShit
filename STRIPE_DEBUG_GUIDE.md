# Stripe Integration Debug Guide

## Проблема
На продакшені не відбувається перенаправлення на Stripe для підписок.

## Можливі причини та рішення

### 1. Відсутні Price ID в змінних середовища
**Проблема:** У `.env.local` відсутні реальні Stripe Price ID
**Рішення:** 
- Зайдіть в Stripe Dashboard
- Створіть Products та Prices для:
  - Pro Monthly ($20/month)
  - Pro Annual ($144/year) 
  - Credits ($10 for 100 credits)
- Замініть заглушки в `.env.local`:
  ```
  NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_real_monthly_id
  NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=price_real_annual_id
  NEXT_PUBLIC_STRIPE_CREDITS_PRICE_ID=price_real_credits_id
  ```

### 2. Перевірка на продакшені
**Кроки діагностики:**
1. Відкрийте Developer Tools (F12)
2. Перейдіть на вкладку Network
3. Спробуйте підписатися на Pro план
4. Перевірте чи відправляється запит до `/api/stripe`
5. Перевірте відповідь сервера

### 3. Можливі помилки
- **400 Bad Request:** Відсутній priceId
- **503 Service Unavailable:** Stripe не налаштований
- **500 Internal Error:** Помилка Stripe API

### 4. Логування для діагностики
Додано детальне логування в `/api/stripe/route.ts`:
- Логування вхідних параметрів
- Логування конфігурації сесії
- Логування помилок Stripe

### 5. Тестування локально
```bash
# Запустіть проект локально
npm run dev

# Перейдіть на /pricing
# Спробуйте підписатися
# Перевірте консоль браузера та термінал
```

### 6. Налаштування Stripe Webhook (для продакшену)
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `invoice.payment_succeeded`
- Secret: додайте в `STRIPE_WEBHOOK_SECRET`

## Поточний статус
- ✅ Додано змінні середовища для Price ID
- ✅ Додано логування в Stripe API
- ⚠️ Потрібно створити реальні Price ID в Stripe Dashboard
- ⚠️ Потрібно протестувати на продакшені
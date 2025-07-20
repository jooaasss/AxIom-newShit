# 🚀 Інструкції для деплою на Netlify

## Крок 1: Створення GitHub репозиторію

1. Зайдіть на [GitHub](https://github.com) під аккаунтом `jooaasss`
2. Натисніть "New repository"
3. Назвіть репозиторій: `AxIom-newShit`
4. Зробіть його публічним
5. НЕ додавайте README, .gitignore або ліцензію (вони вже є)
6. Натисніть "Create repository"

## Крок 2: Завантаження коду

Після створення репозиторію на GitHub, виконайте:

```bash
git push -u origin main
```

## Крок 3: Деплой на Netlify

1. Зайдіть на [Netlify](https://netlify.com)
2. Натисніть "New site from Git"
3. Виберіть GitHub та авторизуйтесь
4. Виберіть репозиторій `jooaasss/AxIom-newShit`
5. Налаштування збірки:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

## Крок 4: Environment Variables

Додайте всі змінні з файлу `.env` в Netlify:

1. Site settings → Environment variables
2. Додайте кожну змінну окремо
3. **ВАЖЛИВО**: Змініть `NEXT_PUBLIC_APP_URL` на ваш Netlify домен

## Крок 5: Налаштування домену

Після успішного деплою:
1. Скопіюйте URL вашого сайту з Netlify
2. Оновіть `NEXT_PUBLIC_APP_URL` в environment variables
3. Редеплойте сайт

## ✅ Готово!

Ваш проект готовий до деплою з:
- ✅ Налаштованим `netlify.toml`
- ✅ Правильними environment variables
- ✅ Git репозиторієм
- ✅ Production конфігурацією

## 🔧 Файли, що були додані/змінені:

- `netlify.toml` - конфігурація для Netlify
- `.env` - оновлено для production
- Git репозиторій ініціалізовано та готовий до push

## 📞 Підтримка

Якщо виникнуть проблеми:
1. Перевірте чи створений репозиторій на GitHub
2. Перевірте чи правильно налаштовані environment variables
3. Перевірте логи збірки в Netlify
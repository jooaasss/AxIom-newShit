# 🚀 Гід по деплойменту та спільній роботі

## 📋 Зміст
1. [Деплоймент на Netlify](#деплоймент-на-netlify)
2. [Організація спільної роботи](#організація-спільної-роботи)
3. [Git Workflow](#git-workflow)
4. [Найкращі практики](#найкращі-практики)
5. [Troubleshooting](#troubleshooting)

---

## 🌐 Деплоймент на Netlify

### Крок 1: Підготовка проекту

```bash
# Переконайтеся, що всі зміни закомічені
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Крок 2: Налаштування Netlify

1. **Створення сайту:**
   - Зайдіть на [netlify.com](https://netlify.com)
   - Натисніть "New site from Git"
   - Підключіть GitHub репозиторій
   - Виберіть гілку `main`

2. **Build settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

### Крок 3: Налаштування змінних середовища

**Обов'язкові змінні:**

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application Settings
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# AI Providers (додайте хоча б один)
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
GOOGLE_GEMINI_API_KEY=...
COHERE_API_KEY=...
HUGGING_FACE_API_KEY=hf_...
GROK_API_KEY=...
DEEPSEEK_API_KEY=...
GITHUB_TOKEN=ghp_...
```

**Опціональні змінні:**

```env
# Stripe (якщо потрібно)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...

# Database (якщо потрібно)
DATABASE_URL=postgresql://...

# Analytics (якщо потрібно)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Крок 4: Деплоймент

1. **Автоматичний деплоймент:**
   - Netlify автоматично деплоїть при push в `main`
   - Перевірте статус в Netlify Dashboard

2. **Ручний деплоймент:**
   ```bash
   # Якщо потрібно форсувати деплоймент
   git commit --allow-empty -m "Force deploy"
   git push origin main
   ```

### Крок 5: Перевірка

1. **Перевірте основні сторінки:**
   - `/` - головна сторінка
   - `/dashboard` - дашборд (потрібна авторизація)
   - `/api/health` - статус API
   - `/api/providers/status` - статус AI провайдерів

2. **Перевірте функціональність:**
   - Реєстрація/вхід
   - Генерація тексту
   - Генерація коду
   - Генерація зображень

---

## 👥 Організація спільної роботи

### Структура гілок

```
main (production)
├── develop (integration)
├── feature/user-name-feature-name
├── bugfix/user-name-bug-description
└── hotfix/critical-fix-name
```

### Правила роботи з гілками

1. **main** - тільки стабільний код, готовий до продакшену
2. **develop** - інтеграційна гілка для тестування
3. **feature/** - нові функції
4. **bugfix/** - виправлення багів
5. **hotfix/** - критичні виправлення для продакшену

---

## 🔄 Git Workflow

### Початок роботи над новою функцією

```bash
# 1. Оновіть main гілку
git checkout main
git pull origin main

# 2. Створіть нову гілку
git checkout -b feature/your-name-new-feature

# 3. Працюйте над функцією
# ... робіть зміни ...

# 4. Комітьте зміни
git add .
git commit -m "feat: add new feature description"

# 5. Пушіть гілку
git push origin feature/your-name-new-feature
```

### Інтеграція змін

```bash
# 1. Перед мерджем оновіть main
git checkout main
git pull origin main

# 2. Перейдіть на свою гілку
git checkout feature/your-name-new-feature

# 3. Зробіть rebase (рекомендовано)
git rebase main

# 4. Вирішіть конфлікти, якщо є
# ... вирішіть конфлікти ...
git add .
git rebase --continue

# 5. Форсовано пушіть (після rebase)
git push --force-with-lease origin feature/your-name-new-feature

# 6. Створіть Pull Request
```

### Формат комітів

```
type(scope): description

Типи:
- feat: нова функція
- fix: виправлення бага
- docs: документація
- style: форматування коду
- refactor: рефакторинг
- test: тести
- chore: технічні зміни

Приклади:
feat(auth): add Google OAuth integration
fix(stripe): resolve payment processing error
docs(readme): update installation instructions
```

---

## ✨ Найкращі практики

### Уникнення конфліктів

1. **Часто синхронізуйтеся з main:**
   ```bash
   # Щодня перед початком роботи
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Розділяйте зони відповідальності:**
   - Один розробник = одна функція/компонент
   - Уникайте одночасної роботи над одними файлами
   - Координуйтеся через issues/tasks

3. **Маленькі, часті коміти:**
   ```bash
   # Краще робити часті маленькі коміти
   git add specific-file.tsx
   git commit -m "feat(component): add button component"
   
   git add another-file.tsx
   git commit -m "feat(component): add button styles"
   ```

### Структура коду

1. **Компоненти:**
   ```
   components/
   ├── ui/           # Базові UI компоненти
   ├── dashboard/    # Компоненти дашборду
   ├── forms/        # Форми
   └── layout/       # Компоненти макету
   ```

2. **Сторінки:**
   ```
   app/
   ├── (auth)/       # Групування авторизації
   ├── dashboard/    # Дашборд
   ├── api/          # API routes
   └── globals.css   # Глобальні стилі
   ```

3. **Утиліти:**
   ```
   lib/
   ├── utils.ts      # Загальні утиліти
   ├── api.ts        # API клієнт
   ├── auth.ts       # Авторизація
   └── constants.ts  # Константи
   ```

### Code Review

1. **Перед створенням PR:**
   - Перевірте, що код працює локально
   - Запустіть тести (якщо є)
   - Перевірте форматування
   - Додайте опис змін

2. **Під час Review:**
   - Перевіряйте логіку
   - Дивіться на продуктивність
   - Перевіряйте безпеку
   - Тестуйте функціональність

---

## 🔧 Troubleshooting

### Проблеми з деплойментом

1. **Build fails:**
   ```bash
   # Перевірте локально
   npm run build
   
   # Перевірте логи в Netlify Dashboard
   # Переконайтеся, що всі змінні середовища налаштовані
   ```

2. **API не працює:**
   - Перевірте `/api/health`
   - Перевірте змінні середовища
   - Перевірте логи функцій в Netlify

3. **Авторизація не працює:**
   - Перевірте Clerk налаштування
   - Перевірте redirect URLs
   - Перевірте домен в Clerk Dashboard

### Проблеми з Git

1. **Конфлікти при merge:**
   ```bash
   # Використовуйте rebase замість merge
   git rebase main
   
   # Або скасуйте merge і зробіть rebase
   git merge --abort
   git rebase main
   ```

2. **Втрачені зміни:**
   ```bash
   # Знайдіть втрачені коміти
   git reflog
   
   # Відновіть коміт
   git cherry-pick <commit-hash>
   ```

3. **Проблеми з push:**
   ```bash
   # Якщо відхилено push після rebase
   git push --force-with-lease origin your-branch
   ```

### Швидкі команди

```bash
# Швидке оновлення з main
alias update-main="git checkout main && git pull origin main"

# Швидкий rebase
alias rebase-main="git rebase main"

# Швидкий статус
alias gs="git status"

# Швидкий коміт
alias gc="git add . && git commit -m"

# Швидкий push
alias gp="git push origin"
```

---

## 📞 Контакти та підтримка

- **Issues:** Створюйте GitHub Issues для багів та пропозицій
- **Discussions:** Використовуйте GitHub Discussions для питань
- **Code Review:** Обов'язковий для всіх PR
- **Documentation:** Оновлюйте документацію при змінах API

---

**Пам'ятайте:** Краще зробити маленький, але якісний коміт, ніж великий з багатьма змінами! 🚀
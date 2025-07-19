# Docker Setup для Polniy AI

Этот проект поддерживает несколько способов развертывания с использованием Docker.

## 🚀 Быстрый старт для разработки

### 1. Только база данных (рекомендуется для разработки)

```bash
# Запуск только PostgreSQL для локальной разработки
docker-compose up -d db

# Запуск Next.js приложения локально
npm run dev
```

### 2. Полная среда разработки

```bash
# Запуск всех сервисов для разработки
docker-compose -f docker-compose.dev.yml up -d

# Остановка
docker-compose -f docker-compose.dev.yml down
```

## 🏭 Продакшен

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## 📊 Доступные сервисы

### Разработка (docker-compose.dev.yml)
- **PostgreSQL**: `localhost:5432`
- **Adminer** (DB UI): `http://localhost:8080`
- **Redis**: `localhost:6379`
- **MailHog** (Email testing): `http://localhost:8025`

### Продакшен (docker-compose.yml)
- **Next.js App**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`
- **Adminer**: `http://localhost:8080`
- **Redis**: `localhost:6379`

## 🔧 Настройка базы данных

### Подключение к PostgreSQL
```
Host: localhost
Port: 5432
Database: try1_db
Username: postgres
Password: password
```

### Миграции Prisma
```bash
# Применить схему к базе данных
npx prisma db push

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio
npx prisma studio
```

## 🛠️ Полезные команды

### Docker
```bash
# Просмотр запущенных контейнеров
docker ps

# Просмотр логов конкретного сервиса
docker-compose logs -f db

# Перестроить образы
docker-compose build --no-cache

# Очистить все данные
docker-compose down -v
docker system prune -a
```

### База данных
```bash
# Подключение к PostgreSQL через psql
docker exec -it polniy-main-db-1 psql -U postgres -d try1_db

# Бэкап базы данных
docker exec polniy-main-db-1 pg_dump -U postgres try1_db > backup.sql

# Восстановление из бэкапа
docker exec -i polniy-main-db-1 psql -U postgres try1_db < backup.sql
```

## 🔒 Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

### Основные переменные:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `CLERK_SECRET_KEY` - секретный ключ Clerk
- `OPENAI_API_KEY` - ключ OpenAI API
- `STRIPE_SECRET_KEY` - секретный ключ Stripe

## 🐛 Решение проблем

### Ошибка подключения к базе данных
```bash
# Проверить статус контейнеров
docker-compose ps

# Перезапустить базу данных
docker-compose restart db

# Проверить логи
docker-compose logs db
```

### Очистка и перезапуск
```bash
# Полная очистка
docker-compose down -v
docker system prune -a

# Перезапуск
docker-compose up -d
```

### Проблемы с портами
```bash
# Проверить занятые порты
lsof -i :5432
lsof -i :3000

# Остановить процессы на портах
sudo kill -9 $(lsof -t -i:5432)
```

## 📝 Примечания

- Для разработки рекомендуется использовать `docker-compose.dev.yml`
- Данные PostgreSQL сохраняются в Docker volumes
- Adminer доступен для управления базой данных через веб-интерфейс
- Redis можно использовать для кэширования и сессий
- MailHog полезен для тестирования отправки email
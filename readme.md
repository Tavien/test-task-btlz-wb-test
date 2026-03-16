# Шаблон для выполнения тестового задания

## Описание

Задача: создать сервис, выполняющий 2 задачи:

- регулярное получение информации о тарифах wb и сохранение их в БД на каждый день;
- регулярное обновление информации о актуальных тарифах в google-таблицах.

Все настройки можно найти в файлах:
- compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

## Команды:

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```
Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```

## Комментарий

Для подключения к Google Sheets требуются креды сервисного аккаунта Google в формате Base64.

Как получить:
1. Перейди в [Google Cloud Console](https://console.cloud.google.com/)
2. Создай сервисный аккаунт и скачай JSON с ключами
3. Закодируй файл в Base64:
```bash
base64 -i credentials.json
```
4. Полученную строку вставь в `.env`:
```env
GOOGLE_CREDENTIALS=<строка из предыдущего шага>
```
5. Не забудь выдать сервисному аккаунту доступ к таблице (кнопка "Поделиться" в Google Sheets и указать почту сервисного аккауна)
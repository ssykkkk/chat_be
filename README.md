# Chat Application Backend

Це бекенд для чату з авторизацією через Google, Facebook та JWT-токени. Він підтримує CRUD-операції з чатами та зберігає дані у MongoDB.

---

## Технології
- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (Google OAuth)
- JWT (JSON Web Tokens)

---

## Встановлення
  git clone https://github.com/your-repo/chat-backend.git
  cd chat-backend
  npm i

---

## Налаштування
Створи файл .env у кореневій папці та додай такі змінні:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

---

## Запуск серверу

node app.js

Сервер запуститься на [http://localhost:5000](http://localhost:5000)

---

## Маршрути
| Метод   | Маршрут          | Опис                          |
|---------|------------------|-------------------------------|
| `POST`  | `/user/register` | Реєстрація нового користувача |
| `POST`  | `/user/login`    | Логін користувача             |
| `GET`   | `/user/google`   | Авторизація через Google      |
| `GET`   | `/user/facebook` | Авторизація через Facebook    |
| `GET`   | `/chats`         | Отримання списку чатів        |
| `POST`  | `/chats`         | Створення нового чату         |
| `PUT`   | `/chats/:id`     | Оновлення чату за ID          |
| `DELETE`| `/chats/:id`     | Видалення чату за ID          |

---

## Авторизація
Для доступу до захищених маршрутів, необхідно передавати `accessToken` у Headers:

Authorization: Bearer your_access_token

---

## Можливі покращення
- Додавання сокетів для реального часу (Socket.IO).
- Нотифікації про нові повідомлення.
- Підключення Redis для кешування сесій.

---

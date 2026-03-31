# RollOut Café Platform

A simple, beginner-friendly full-stack demo: **e-commerce** (cycling gear, apparel, nutrition), **café ordering** (coffee and food), and **community events** — single monolith backend, one MySQL database, React frontend.

## Architecture

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Lombok |
| Frontend | React 18, Vite, React Router, Axios, Bootstrap 5 |
| Database | MySQL 8 |

Auth is intentionally minimal: **no JWT, no Spring Security** — email/password are checked against the database only (passwords stored as plain text for learning; do not use this pattern in production).

## Prerequisites

- **JDK 17+**
- **Maven 3.8+**
- **Node.js 18+** and npm
- **MySQL 8** running locally

## Database setup

1. Start MySQL.
2. Create a database (optional — JDBC URL can create it if your user has permission):

   ```sql
   CREATE DATABASE rollout_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Edit `backend/rollout-app/src/main/resources/application.properties`:

   - `spring.datasource.username` / `spring.datasource.password` — match your MySQL user.
   - Adjust `spring.datasource.url` if your port or database name differs.

On first run, JPA **`ddl-auto=update`** creates tables. A **`DataLoader`** seeds sample products, events, and two users if tables are empty.

### Seed logins

| Email               | Password  | Role  |
|---------------------|-----------|-------|
| `admin@rollout.cafe` | `admin123` | ADMIN |
| `demo@rollout.cafe`  | `demo123`  | USER  |

## Run the backend

```bash
cd backend/rollout-app
mvn spring-boot:run
```

API base: **http://localhost:8080**

### REST endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register (`email`, `password`, optional `role`) |
| POST | `/auth/login` | Login |
| GET | `/products` | List all products |
| GET | `/products/category/{category}` | Filter by `COFFEE`, `FOOD`, `CYCLING_GEAR`, `APPAREL`, `NUTRITION` |
| POST | `/products` | Create product (body: `name`, `description`, `price`, `category`) |
| DELETE | `/products/{id}` | Delete product |
| POST | `/orders` | Place order (`userId`, `items`: `[{ "productId", "quantity" }]`) |
| GET | `/events` | List events |
| POST | `/events` | Create event (`title`, `description`, `date`, `location`) |

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:3000** — Vite proxies `/auth`, `/products`, `/orders`, and `/events` to the backend.

For a **production build** served separately, set the API URL when building:

```bash
set VITE_API_URL=http://localhost:8080
npm run build
```

(Syntax on macOS/Linux: `VITE_API_URL=http://localhost:8080 npm run build`.)

## Project layout

```
rollout-platform/
├── backend/rollout-app/
│   ├── src/main/java/com/rollout/app/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── config/
│   │   └── exception/
│   └── src/main/resources/application.properties
├── frontend/
│   └── src/   (pages, components, context, api)
└── README.md
```

## Frontend pages

- **Home** — Overview and navigation
- **Shop** — Gear, apparel, nutrition
- **Café** — Coffee and food
- **Cart** — React state cart, checkout → `POST /orders`
- **Login** — Register / log in; session stored in `localStorage`
- **Admin** — Add/delete products (visible when logged in as `ADMIN`)
- **Events** — List events; admins can add events

## Not included (by design)

Docker, microservices, JWT, Spring Security, and production-grade password hashing — kept simple for learning and portfolios.

## License

Use freely for learning and portfolio work.

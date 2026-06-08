# Store Rating Platform

A full-stack web application where users can discover stores, submit ratings (1–5 stars), and manage the platform based on their role. Built as a **FullStack Intern Coding Challenge** solution.

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS v4     |
| Backend    | Express.js 5, Node.js                           |
| Database   | PostgreSQL                                      |
| ORM        | Prisma 7                                        |
| Auth       | JWT (JSON Web Tokens) + bcrypt password hashing |

---

## Live Demo

| Service         | URL |
| --------------- | --- |
| **Frontend**    | [https://store-rating-platform-mu.vercel.app](https://store-rating-platform-mu.vercel.app) |
| **Backend API** | [https://store-rating-platform-production.up.railway.app/api](https://store-rating-platform-production.up.railway.app/api) |
| **GitHub**      | [https://github.com/shagun101pareek/store-rating-platform](https://github.com/shagun101pareek/store-rating-platform) |

---

## Demo Access

The live deployment includes seeded demo accounts for reviewers. Use the login page and try one of these roles:

| Role         | How to test |
| ------------ | ----------- |
| **Admin**    | Log in with the admin account created during deployment (see project maintainer for credentials) |
| **User**     | Sign up at `/signup`, or use a seeded user account |
| **Store Owner** | Log in with a store-owner account linked to a registered store |

> **Security note:** Demo passwords are not published in this repository. Rotate all credentials before sharing a production deployment publicly.

---

## What This Project Does

Store Rating Platform is a **role-based store review system**. A single login page serves all users; after authentication, each person is redirected to the dashboard that matches their role:

```
                    ┌─────────────┐
                    │  Login /    │
                    │  Signup     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌──────────────┐
    │   ADMIN    │  │    USER    │  │ STORE_OWNER  │
    │ Dashboard  │  │ Home/Stores│  │  Analytics   │
    │ Users      │  │ My Ratings │  │  Reviews     │
    │ Stores     │  │ Profile    │  │  Profile     │
    └────────────┘  └────────────┘  └──────────────┘
```

1. **Normal users** browse stores, search by name/address, and rate stores from 1 to 5. They can update their rating later.
2. **Store owners** see their store's average rating and a list of customers who rated them. They can also update their store profile and image.
3. **System administrators** manage the entire platform — users, stores, and global statistics.

---

## User Roles & Features

### 1. System Administrator

| Feature | Details |
| ------- | ------- |
| Dashboard with totals | Total users, stores, and ratings |
| Create users | Name, email, password, address, role (ADMIN / USER / STORE_OWNER) |
| Create stores | Name, email, address, owner assignment, optional image |
| List all stores | Name, email, address, average rating |
| List all users | Name, email, address, role |
| Filter listings | Filter by name, email, address; users also by role |
| Sort tables | Ascending/descending on key columns |
| View user / store details | Full profile with ratings where applicable |
| Change password & logout | Available from sidebar |

**Bonus features (beyond assignment):**

- Global Ratings page — overview of all store ratings sorted by score
- Role badges — color-coded ADMIN / USER / STORE_OWNER labels
- Store image upload when registering a new store

![Admin — Manage Stores](./docs/screenshots/admin-manage-stores.png)

![Admin — User Directory](./docs/screenshots/admin-user-directory.png)

---

### 2. Normal User

| Feature | Details |
| ------- | ------- |
| Sign up & login | Name, email, address, password |
| Browse all stores | Card grid with images, ratings, and addresses |
| Search & sort | By store name or address; A → Z / Z → A |
| Submit / update rating | Interactive 1–5 star modal |
| Change password & logout | Dedicated pages |

**Bonus features (beyond assignment):**

- Home dashboard with personal stats
- My Ratings page
- Profile page
- Pagination (9 stores per page)
- Store images with gradient/initials fallback
- Fully responsive mobile UI

![User — Home Dashboard](./docs/screenshots/user-home.png)

![User — Explore Stores](./docs/screenshots/user-explore-stores.png)

---

### 3. Store Owner

| Feature | Details |
| ------- | ------- |
| View average store rating | Store Analytics dashboard |
| View users who rated | Customer Reviews table |
| Sort customer ratings | By user name or rating value |
| Change password & logout | From sidebar |

**Bonus features (beyond assignment):**

- Store Profile page — update name, address, and image
- Image upload/remove with client-side resize & compression
- Fallback initials-based gradient when no photo is uploaded

![Store Owner — Store Profile](./docs/screenshots/owner-store-profile.png)

---

## Form Validations

Validated on **both frontend and backend** (express-validator + client-side checks).

| Field    | Rule                                                                 |
| -------- | -------------------------------------------------------------------- |
| Name     | 20–60 characters                                                     |
| Address  | Max 400 characters                                                   |
| Password | 8–16 characters, at least one uppercase letter and one special char (`!@#$%^&*`) |
| Email    | Standard email format                                                |

---

## Architecture

### Authentication Flow

1. User logs in → server returns a **JWT** and user object (id, name, email, role).
2. Frontend stores the token in `localStorage` and attaches it to API requests.
3. **Protected routes** on the frontend redirect unauthorized users.
4. **Backend middleware** (`authenticate` + `authorize`) enforces role access per endpoint.

### Database Schema

```
User (id, name, email, password, address, role)
  ├── owns ──► Store (id, name, email, address, imageUrl, ownerId)
  │                └── has many ──► Rating (id, rating 1-5, userId, storeId)
  └── has many ──► Rating
```

### API Endpoints

| Method | Endpoint | Role | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/auth/signup` | Public | Register normal user |
| POST | `/api/auth/login` | Public | Login (all roles) |
| PATCH | `/api/auth/change-password` | Authenticated | Update password |
| GET | `/api/admin/dashboard` | ADMIN | Platform statistics |
| GET/POST | `/api/admin/users` | ADMIN | List / create users |
| GET | `/api/admin/users/:id` | ADMIN | User details |
| GET/POST | `/api/admin/stores` | ADMIN | List / create stores |
| GET | `/api/admin/stores/:id` | ADMIN | Store details |
| GET | `/api/stores` | Authenticated | Browse stores (search, sort) |
| POST | `/api/ratings` | USER | Submit a rating |
| PATCH | `/api/ratings/:storeId` | USER | Update a rating |
| GET | `/api/owner/dashboard` | STORE_OWNER | Analytics summary |
| GET | `/api/owner/ratings` | STORE_OWNER | Customer ratings list |
| GET/PATCH | `/api/owner/store` | STORE_OWNER | View / update store profile |

---

## Project Structure

```
store-rating-platform/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route pages per role
│   │   ├── layouts/         # AdminLayout, UserLayout, OwnerLayout
│   │   ├── services/        # Axios API clients
│   │   └── routes/          # React Router + role guards
│   └── .env.example         # Environment variable template
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth & role authorization
│   │   └── validators/      # express-validator rules
│   ├── prisma/              # Schema & migrations
│   └── .env.example         # Environment variable template
└── docs/screenshots/        # README screenshots
```

---

## Deployment & Setup

The application runs across Railway (API), Vercel (frontend), and Neon (database). Clone the repo, copy the `.env.example` templates, configure the variables below, and run migrations before starting each service.

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech))

### 1. Clone the repository

```bash
git clone https://github.com/shagun101pareek/store-rating-platform.git
cd store-rating-platform
```

### 2. Backend (Railway)

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate deploy
npm start
```

| Variable | Value |
| -------- | ----- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Strong random secret |
| `PORT` | `5000` |
| `CORS_ORIGIN` | `https://store-rating-platform-mu.vercel.app` |

**Live API:** [https://store-rating-platform-production.up.railway.app/api](https://store-rating-platform-production.up.railway.app/api)

### 3. Frontend (Vercel)

```bash
cd client
npm install
cp .env.example .env
npm run build
```

| Variable | Value |
| -------- | ----- |
| `VITE_API_URL` | `https://store-rating-platform-production.up.railway.app/api` |

**Live app:** [https://store-rating-platform-mu.vercel.app](https://store-rating-platform-mu.vercel.app)

### Infrastructure summary

| Component  | Platform | Required environment variables |
| ---------- | -------- | ------------------------------ |
| Backend    | [Railway](https://railway.app) | `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN` |
| Frontend   | [Vercel](https://vercel.com) | `VITE_API_URL` |
| Database   | [Neon PostgreSQL](https://neon.tech) | Connection string → `DATABASE_URL` |

---

## Assignment Compliance

| Requirement | Status |
| ----------- | ------ |
| Express.js backend | ✅ |
| PostgreSQL database | ✅ |
| React frontend | ✅ |
| Single login for all roles | ✅ |
| User signup (normal users) | ✅ |
| Admin dashboard, CRUD, filters, sorting | ✅ |
| User store listing, search, ratings | ✅ |
| Store owner analytics & reviews | ✅ |
| Change password (all roles) | ✅ |
| Form validations per spec | ✅ |
| Table sorting | ✅ |
| Logout | ✅ |

---

## License

Built for educational / internship assessment purposes.

# Influencer base - An Influencer Directory Web App

A full-stack mini web application built with **Next.js (App Router)**, **PostgreSQL**, **Prisma ORM**, and **TailwindCSS**. The app allows teams to **browse, search, filter, sort, delete and manage influencer data** with role-based access control.

---

## Live web application link

- [Click here]() to view the live web application.

## Features

- **Authentication & RBAC**

  - Email / password based login system
  - Email / password / role based registration system
  - JWT-token based authentication system
  - Role-based permissions (Admin / Viewer) system

- **Influencer Directory**

  - Paginated influencer list, responsive table with horizontal slider
  - Sorting by **followers**, **engagement rate** & by the **created_at**
  - Filters: Name, username, platform, followers, country, categories and also resetting filters

- **Influencer Details**

  - Viewer can see read-only data only
  - Admin can create, read, update and delete any influencer data

- **Admin CRUD**

  - Create, read, update, delete influencers
  - Proper validation & error responses (`422`, `401`, `403`)

- **Seeding**

  - 2,000+ realistic influencers
  - Users:

    - `admin@example.com / Admin123!`
    - `viewer@example.com / Viewer123!`

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT, bcryptjs
- **Seeding:** @faker-js/faker

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/influencer-directory.git
cd influencer-directory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env

DATABASE_URL="postgresql://username:password@localhost:5432/influencerdb" or "enter your postgreSQL database url" or "enter your neonDB database url of postgreSQL"
NODE_ENV=development
JWT_SECRET="enter your super secret key"
JWT_EXPIRES_IN=86400
```

### 4. Database setup

Run Prisma migrations and seed data:

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the dev server

```bash
npm run dev
```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

## Test Accounts

| Role   | Email                                           | Password   |
| ------ | ----------------------------------------------- | ---------- |
| Admin  | [admin@example.com](mailto:admin@example.com)   | Admin123!  |
| Viewer | [viewer@example.com](mailto:viewer@example.com) | Viewer123! |

---

## Seeding Details

- **2000+ influencers** generated with `@faker-js/faker`
- Balanced distribution across **Instagram, TikTok, YouTube, X**
- Realistic followers & engagement rates
- Indexed columns: (details explained below)

  - `platform`
  - `followers`
  - `engagement_rate`
  - `country`

---

### Indexing Decisions on detail

- **`@@unique([platform, username])`** → Prevents duplicate influencer entries on the same platform.
- **`@@index([platform])`** → Speeds up lookups and filtering by social media platform.
- **`@@index([followers])`** → Optimizes range queries (e.g., min/max follower counts).
- **`@@index([engagement_rate])`** → Improves filtering and sorting by engagement rate.
- **`@@index([country])`** → Enables efficient searches by country code.

## API Overview

### Auth

- `POST /api/auth/users` → Create user
- `POST /api/auth/login` → Login & get token
- `POST /api/auth/me` → Token verification route

### Influencers

- `GET /api/influencers` → Paginated list (filters, search, sort)
- `GET /api/influencers/:id` → Single influencer
- `POST /api/influencers` → Create (Admin only)
- `PUT /api/influencers/:id` → Update (Admin only)
- `DELETE /api/influencers/:id` → Delete (Admin only)

---

## Assumptions & Trade-offs

- I have used **JWT stored in localStorage** for simplicity and to build the prototype fast (could have used HttpOnly cookies for higher security).
- Used **take/skip pagination** for balance between simplicity and efficiency. Cursor-based pagination could be used for larger datasets, more efficiency and more stability.
- Minimal design polish; focused on functionality and responsiveness.
- Role checks enforced in API handlers to prevent unauthorized access.

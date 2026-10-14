# Edusity

A full-stack ed-tech platform where students can browse and enroll in courses, instructors can create and manage content, and admins handle platform-level data.

Built with the MERN stack, with Redis Cloud caching for fast course data delivery.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit
- React Router v7
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Redis Cloud (ioredis) — course caching
- JWT + Bcrypt — auth
- Cloudinary — media uploads
- Razorpay — payments
- Nodemailer — transactional email

---

## Features

- Email OTP signup and login
- JWT-based auth with role access (Student, Instructor, Admin)
- Instructor course creation — sections, subsections, thumbnails
- Course catalog and detail pages
- Student enrollment via Razorpay
- Profile management and avatar upload
- Contact form with email delivery
- Redis caching on course endpoints (~6× faster responses)
- Admin routes for categories and users

---

## Project Structure

```
edusity/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── slices/
│
├── server/
│   ├── config/         # db, redis, cloudinary, cache TTL
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── .gitignore
├── package.json
└── README.md
```

---

## API Routes

```
POST   /api/v1/auth/*       — signup, login, OTP, password reset
GET    /api/v1/profile/*    — profile data and updates
GET    /api/v1/course/      — all courses (cached)
GET    /api/v1/course/:id   — course details (cached)
POST   /api/v1/course/      — create course (instructor)
DELETE /api/v1/course/:id   — delete course
PATCH  /api/v1/course/:id/publish
POST   /api/v1/payment/*    — Razorpay order and verification
POST   /api/v1/contact      — contact form
```

---

## Caching

Course list and course detail responses are cached in Redis Cloud with a 10-minute TTL.

- First request hits MongoDB (~220 ms)
- Subsequent requests are served from Redis (~30 ms)
- Cache is invalidated automatically on create, update, delete, or publish

To benchmark it locally:

```bash
node test-cache.js
```

---

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in your values:

```env
PORT=4000
MONGODB_URL=

JWT_SECRET=

MAIL_HOST=smtp.gmail.com
MAIL_USER=
MAIL_PASS=

CLOUD_NAME=
API_KEY=
API_SECRET=
FOLDER_NAME=

RAZORPAY_KEY=
RAZORPAY_SECRET=

REDIS_URL=redis://default:<password>@<host>:<port>
```

Frontend — create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY_ID=
```

---

## Getting Started

Install all dependencies:

```bash
npm install              # root (concurrently)
npm install --prefix server
npm install --prefix frontend
```

Run both frontend and backend together:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev --prefix server     # http://localhost:4000
npm run dev --prefix frontend   # http://localhost:3000
```

---

## Auth Flow

1. User requests an OTP to their email
2. OTP is stored in MongoDB with expiry
3. User signs up with OTP + details → password hashed with bcrypt
4. Login returns a JWT stored in an HTTP-only cookie
5. Protected routes verify the token via middleware
6. Role middleware restricts instructor and admin routes

---

## Course Flow

1. Instructor creates a course with a thumbnail
2. Thumbnail is uploaded to Cloudinary
3. Instructor adds sections and subsections
4. Course is published once content is complete
5. Students browse the catalog, view details, and enroll via Razorpay

---

## Security Notes

- All secrets live in `.env` — never committed to git
- Passwords hashed with bcrypt
- JWT verified on every protected request
- CORS restricted to the frontend origin
- Use HTTPS and strong secrets in production

---

## Author

Developed by Samim Kausar.

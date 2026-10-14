# Edusity - StudyNotion Learning Platform

Edusity is a full-stack learning management platform built with the MERN stack. It allows students to browse and enroll in courses, instructors to create and manage course content, and admins to manage platform-level data such as categories and users.

## Tech Stack

**Frontend**
- React.js
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Cookie Parser
- Nodemailer
- Cloudinary
- Razorpay
- Express File Upload

## Features

- User signup and login
- OTP-based email verification
- JWT-based authentication
- Role-based access control for Student, Instructor, and Admin
- Student dashboard
- Instructor course creation flow
- Course sections and subsections
- Course publishing
- Course catalog and course details pages
- Profile management
- Display picture upload using Cloudinary
- Razorpay payment integration
- Contact form with email support
- Admin routes for managing users and categories

## Project Structure

```text
edusity/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── reducer/
│   │   ├── services/
│   │   └── slices/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── package.json
└── README.md
```

## Backend API Modules

The backend follows an MVC-style structure:

- `models/` contains Mongoose schemas.
- `controllers/` contains business logic.
- `routes/` contains API route definitions.
- `middlewares/` contains authentication and role-checking middleware.
- `config/` contains database, Cloudinary, and Razorpay configuration.
- `utils/` contains helper utilities such as mail sending and image upload.

Main route groups:

```text
/api/v1/auth
/api/v1/profile
/api/v1/course
/api/v1/payment
/api/v1/contact
```

## Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_email_app_password

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_cloudinary_folder_name

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

CLIENT_URL=http://localhost:3000
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_BASE_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

Do not commit `.env` files to GitHub.

## Installation

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running Locally

From the root folder:

```bash
npm run dev
```

This starts both the backend and frontend.

Or run them separately:

Backend:

```bash
cd server
npm run start
```

Frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:4000
```

## Authentication Flow

1. User requests OTP using email.
2. OTP is generated and stored in MongoDB.
3. User submits signup details with OTP.
4. Password is hashed using bcrypt.
5. User data is saved in MongoDB.
6. During login, credentials are verified.
7. A JWT token is generated and returned to the client.
8. Protected backend routes verify the token using authentication middleware.
9. Role-based middleware restricts access for Student, Instructor, and Admin routes.

## Course Flow

1. Instructor creates a course.
2. Course thumbnail is uploaded to Cloudinary.
3. Instructor adds sections and subsections.
4. Course can be published after required content is added.
5. Students can view course details and enroll through payment.

## Payment Flow

1. Student initiates course purchase.
2. Backend creates a Razorpay order.
3. Frontend opens Razorpay checkout.
4. Razorpay returns payment details.
5. Backend verifies payment signature.
6. Student is enrolled in the course after successful verification.

## Important Security Notes

- Store secrets in environment variables.
- Never commit `.env` files.
- Use strong `JWT_SECRET` values in production.
- Hash passwords before saving.
- Validate all request bodies.
- Use HTTPS in production.
- Configure CORS using environment variables.
- Add rate limiting for auth and OTP routes.
- Use secure and HTTP-only cookies if using cookie-based auth.

## Deployment Notes

Before deploying:

- Set production `VITE_BASE_URL`.
- Set production backend environment variables.
- Configure MongoDB Atlas network access.
- Configure Cloudinary credentials.
- Configure Razorpay live/test keys as needed.
- Update CORS origin to the deployed frontend URL.
- Build the frontend using:

```bash
cd frontend
npm run build
```

## Future Improvements

- Add refresh token support.
- Add rate limiting for login and OTP APIs.
- Add stronger request validation using Joi or Zod.
- Add pagination for course and user listing APIs.
- Add centralized error handling middleware.
- Add logging with Winston or Pino.
- Add automated tests.
- Add Docker support.
- Add CI/CD pipeline.

## Author

Developed by Samim Kausar.

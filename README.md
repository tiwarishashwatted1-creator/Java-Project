# Student Registration System (MERN)

A production-ready starter for a web-based student registration and verification platform.

## Features
- 👩‍🎓 **Student Registration** with form validation
- 🔐 **Auth**: JWT login (Student & Admin), role-based access
- 🗂️ **Student Records**: search, update, delete
- 🧾 **Verification**: admin review (approve/reject) with document upload
- 📊 **Dashboards**: Student & Admin
- 📤 **Reports**: export CSV/XML by course/year/status
- ✉️ **Notifications**: email (Nodemailer) + optional SMS (Twilio)
- 🛡️ **Security**: Helmet, CORS, rate limiting, hashed passwords
- ⚙️ **Scalable**: MongoDB + modular architecture

## Tech
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT
- **Frontend**: React (Vite), React Router, React Hook Form, TailwindCSS
- **Utilities**: Multer (file upload), Nodemailer, csv-stringify, xmlbuilder2

---

## Quick Start

### 1) Prereqs
- Node.js 18+
- MongoDB (local or Atlas)

### 2) Backend setup
```bash
cd server
cp .env.example .env   # fill values
npm install
npm run dev
```
Server runs on `http://localhost:5000`.

### 3) Frontend setup
```bash
cd ../client
npm install
npm run dev
```
App on `http://localhost:5173` (Vite).

> Default admin is created on first run if `SEED_ADMIN=true` in `.env`.

### Environment (`server/.env.example`)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_reg
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173
SEED_ADMIN=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123

# Email (Mailtrap or SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Registrar <no-reply@univ.test>"

# Optional SMS (Twilio)
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
```

### Scripts
- **server**: `npm run dev` (nodemon), `npm start` (prod)
- **client**: `npm run dev`, `npm run build`, `npm run preview`

### API (selected)
- `POST /api/auth/register` — create student user
- `POST /api/auth/login` — login (student/admin)
- `POST /api/students` — submit registration form (student)
- `GET /api/students` — list (admin filters: `?course=...&status=...&year=...&q=...`)
- `PATCH /api/students/:id/status` — approve/reject (admin)
- `POST /api/students/:id/docs` — upload documents (student)
- `GET /api/reports/export.csv?status=...` — CSV
- `GET /api/reports/export.xml?status=...` — XML

### Notes
- For production, put the server behind HTTPS, add proper CORS, set secure cookies or short-lived JWT + refresh tokens.
- File uploads go to `server/uploads/`. In production use S3 or other object storage.

---

## License
MIT

# 📧 BulkMail – Bulk Email Management System

A full-stack Bulk Email Management Application built using the MERN stack. BulkMail allows users to send bulk email campaigns, manage recipients, track campaign history, and monitor email activity through an interactive dashboard.

The application uses **Brevo Transactional Email API** for email delivery, MongoDB for data storage, and JWT authentication for secure access.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Role-based access control (Admin and User).
- Protected dashboard routes.
- Session-based frontend authentication.
- Secure logout functionality.
- Admin-only account management.

### 📩 Bulk Email Management
- Send emails to multiple recipients.
- Automatic batch processing.
- Maximum 50 recipients per batch.
- Maximum 500 unique recipients per campaign.
- Duplicate email removal.
- Email address validation.
- BCC-based recipient privacy.
- Brevo API integration for email delivery.
- Individual batch error handling.

### 📊 Dashboard
- Total email campaigns.
- Successful campaigns.
- Partially processed campaigns.
- Failed campaigns.
- Total recipient statistics.
- Daily email activity analytics.
- Interactive charts.

### 📜 Email History
- View previously processed campaigns.
- Search campaigns by subject or recipient.
- Filter campaigns by status.
- View complete campaign details.
- Display recipient information.
- View campaign dates and status.

### 📱 Responsive Design
- Mobile-friendly interface.
- Responsive dashboard.
- Responsive navigation sidebar.
- Mobile-friendly email history cards.
- Responsive search and filter controls.
- Responsive email details modal.

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Express Rate Limit
- CORS
- dotenv

### Email Service
- Brevo Transactional Email API
- Fetch API (HTTPS)

### Deployment
- Vercel – Frontend Hosting
- Render – Backend Hosting
- MongoDB Atlas – Cloud Database

---

## 📁 Project Structure

```text
Bulk_Mail_App/
│
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SendEmail.jsx
│   │   │   ├── EmailHistory.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── CreateAdmin.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── vercel.json
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── mailer.js
│   │
│   ├── controllers/
│   │   ├── emailController.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── models/
│   │   ├── emailModel.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── emailRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js 20 or later
- npm
- MongoDB Atlas account or local MongoDB
- Brevo account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sivaraj-bit/Bulk_Mail_App.git
```

Navigate to the project directory:

```bash
cd Bulk_Mail_App
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER_EMAIL=your_verified_sender_email

BREVO_SENDER_NAME=BulkMail
```

**Environment Variable Description**

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT authentication |
| BREVO_API_KEY | Brevo API authentication key |
| BREVO_SENDER_EMAIL | Verified sender email in Brevo |
| BREVO_SENDER_NAME | Sender display name |

**Important:**
- Use a Brevo API key, not an SMTP key.
- Verify your sender email in Brevo.
- Keep all API keys and passwords private.
- Never commit `.env` files to GitHub.

### 4. Start the Backend Server

From the `server` directory:

```bash
npm start
```

Backend runs at:

```text
http://localhost:5000
```

Expected terminal output:

```text
MongoDB connected successfully
Server running on port 5000
Brevo API connected successfully!
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd Client
npm install
```

### 6. Configure Frontend Environment Variables

Create a `.env` file inside the `Client` directory.

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open the URL in your browser to access BulkMail.

---

## 🔗 API Endpoints

The backend uses the following API structure.

Base URL:

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate user |
| POST | `/user/register` | Register a new user |

### Email APIs

All email routes require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/emails/send` | Send bulk emails |
| GET | `/emails/history` | Retrieve email history |
| GET | `/emails/stats` | Retrieve dashboard statistics |
| GET | `/emails/analytics/daily` | Retrieve daily email analytics |

### Admin APIs

Admin-related routes are available through:

```text
/api/admin
```

Admin operations are protected by authentication and authorization middleware.

---

## 📦 Bulk Email Processing

BulkMail uses automatic batch processing to handle multiple recipients.

### Processing Configuration

| Configuration | Value |
|---|---:|
| Batch Size | 50 recipients |
| Maximum Recipients | 500 |
| Duplicate Emails | Removed |
| Recipient Privacy | BCC |
| Email Provider | Brevo API |

### Example

Suppose a campaign contains 120 unique recipients.

The application processes them in three batches:

```text
Batch 1 → 50 recipients
Batch 2 → 50 recipients
Batch 3 → 20 recipients
```

Each batch is sent separately through the Brevo API.

### Email Status

| Status | Description |
|---|---|
| Pending | Campaign processing started |
| Sent | All recipients accepted by Brevo |
| Partial | Some recipients accepted and others failed |
| Failed | No recipients accepted |

**Note:** The `Sent` status currently represents successful acceptance by Brevo's API. It does not independently confirm inbox delivery. Delivery tracking requires Brevo webhooks.

---

## 🔒 Security

BulkMail includes:

- JWT authentication.
- Password hashing using bcryptjs.
- Protected API routes.
- Role-based authorization.
- Request rate limiting.
- Environment-based secret management.
- Session-based frontend token storage.
- BCC recipient privacy.

### Authentication Session

The frontend uses `sessionStorage` to store authentication information.

Expected behavior:

1. Open BulkMail → Login page.
2. Login successfully → Dashboard.
3. Refresh the page → Stay authenticated.
4. Logout → Login page.
5. Open the application in a new browser tab → Login is required.

The backend JWT authentication remains unchanged.

---

## 🌐 Deployment

### Frontend Deployment – Vercel

1. Push your project to GitHub.
2. Open Vercel.
3. Import the `Bulk_Mail_App` repository.
4. Set the Root Directory to:

```text
Client
```

5. Configure the following environment variable:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

6. Build Command:

```bash
npm run build
```

7. Output Directory:

```text
dist
```

8. Deploy the application.

### Vercel SPA Routing

Create `Client/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This supports React Router navigation and direct page refreshes.

### Backend Deployment – Render

1. Open Render.
2. Create a new Web Service.
3. Connect the GitHub repository.
4. Set Root Directory:

```text
server
```

5. Configure:

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

6. Add the backend environment variables in Render.
7. Deploy the service.

### Brevo Configuration

For production email sending:

- Generate a Brevo API key.
- Add it as `BREVO_API_KEY` in Render.
- Configure your verified sender email.
- Add the sender name.
- If Brevo authorized-IP restrictions are enabled, authorize the required Render outbound IP ranges.

The backend sends email requests to Brevo using HTTPS.

---

## 🧪 Testing Checklist

- [ ] User registration works.
- [ ] User login works.
- [ ] Admin login works.
- [ ] Protected routes work.
- [ ] Logout works.
- [ ] Dashboard statistics display correctly.
- [ ] Bulk email validation works.
- [ ] Duplicate recipients are removed.
- [ ] Batch processing works.
- [ ] Brevo accepts email requests.
- [ ] Email history loads correctly.
- [ ] Search functionality works.
- [ ] Status filters work.
- [ ] Campaign details modal works.
- [ ] Daily analytics display correctly.
- [ ] Mobile responsive layout works.
- [ ] Direct route refresh works on Vercel.

---

## 🎨 Design

BulkMail uses a professional teal and dark navy color theme.

| Color | Hex Code | Usage |
|---|---|---|
| Dark Navy | `#0B1F2A` | Main background and text |
| Teal | `#0F766E` | Primary actions and accents |
| Light Teal | `#2DD4BF` | Highlights |
| Background | `#F4F8F8` | Page background |
| White | `#FFFFFF` | Cards and content areas |

The interface is built with Tailwind CSS and supports desktop, tablet, and mobile screens.

---

## 👨‍💻 Developer

**Sivaraj G**

B.Sc. Data Science Graduate  
MERN Stack Developer

GitHub: [sivaraj-bit](https://github.com/sivaraj-bit)

---

## 📄 License

This project is developed for learning and portfolio purposes.

You may use and modify the project for educational purposes.

---

**Built with React, Node.js, Express, MongoDB, and Brevo.**

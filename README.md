# FinPilot — Backend API

### 🌐 Live API: [https://finease-server.vercel.app](https://finease-server.vercel.app)
### 🔗 Frontend: [https://finease-app.netlify.app](https://finease-app.netlify.app)

---

## 📌 About

This is the RESTful backend API for **FinPilot** — a personal finance management application. Built with Express.js and MongoDB, it handles user authentication (email/password + Google via Firebase Admin), and full CRUD operations for financial transactions.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure token-based auth with 7-day expiry. Tokens are verified on every protected request via middleware.
- 🔑 **Google Sign-In** — Firebase Admin SDK verifies Google ID tokens and issues the app's own JWT for consistency.
- 🔒 **Password Security** — Passwords hashed with bcryptjs via a Mongoose pre-save hook. Plain text passwords never touch the database.
- 💸 **Transaction CRUD** — Full create, read, update, delete for transactions. All operations include ownership verification — users can only access their own data.
- 📊 **Financial Aggregations** — MongoDB aggregation pipelines power the summary endpoint (total income, expenses, balance) and category totals.
- 🛡️ **Protected Routes** — All transaction routes are behind the `protect` middleware. Unauthorized requests return clear 401 responses.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Google Auth | Firebase Admin SDK |
| Deployment | Vercel |

---

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "mongoose": "^8.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "firebase-admin": "^12.x",
  "cors": "^2.x",
  "dotenv": "^16.x"
}
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project with a service account key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/almamunrasel/FiPilot-server.git
cd FinPilot-server

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

### Environment Variables

Fill in your `.env` file:

```bash
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finease

# JWT
JWT_SECRET=your_super_long_random_secret_key
JWT_EXPIRES_IN=7d

# Firebase Admin SDK (from Firebase Console → Service Accounts → Generate Key)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

### Run Development Server

```bash
npm run dev
```

API runs on `http://localhost:5000`

---

## 📁 Project Structure

```
finease-server/
├── config/
│   ├── db.js              ← MongoDB connection
│   └── firebase.js        ← Firebase Admin SDK init
├── controllers/
│   ├── authController.js  ← register, login, google, getMe, updateProfile
│   └── transactionController.js ← CRUD + summary + categoryTotal
├── middleware/
│   └── auth.js            ← protect() middleware
├── models/
│   ├── User.js            ← User schema with bcrypt hook
│   └── Transaction.js     ← Transaction schema
├── routes/
│   ├── authRoutes.js
│   └── transactionRoutes.js
├── utils/
│   └── jwt.js             ← generateToken / verifyToken
├── .env.example
├── .gitignore
├── index.js               ← Entry point
├── package.json
└── vercel.json            ← Vercel deployment config
```

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register with name, email, password, photoURL |
| POST | `/login` | Public | Login with email and password |
| POST | `/google` | Public | Sign in with Google ID token |
| GET | `/me` | Private | Get currently logged-in user |
| PUT | `/update-profile` | Private | Update name and photoURL |

### Transaction Routes — `/api/transactions`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Create a new transaction |
| GET | `/` | Private | Get all transactions for logged-in user |
| GET | `/summary` | Private | Get total income, expense, balance |
| GET | `/:id` | Private | Get single transaction + category total |
| PUT | `/:id` | Private | Update a transaction |
| DELETE | `/:id` | Private | Delete a transaction |

---

## 🔐 Authentication Flow

```
Client                          Server
  │                               │
  ├─── POST /api/auth/login ──────►│
  │    { email, password }        │ verify password with bcrypt
  │                               │ generate JWT
  ◄─── { token, user } ──────────┤
  │                               │
  ├─── GET /api/transactions ─────►│
  │    Authorization: Bearer token │ protect middleware verifies JWT
  │                               │ attach req.user
  ◄─── { transactions: [...] } ──┤
```

---

## 🌍 Deployment on Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard → Settings → Environment Variables
4. Add `0.0.0.0/0` to MongoDB Atlas → Network Access → IP Whitelist
5. Redeploy after adding env vars

---

## 👨‍💻 Author

**Mr. A.M.R**
- GitHub: [@almamunrasel](https://github.com/almamunrasel)
- Email: your@email.com

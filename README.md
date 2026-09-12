# SARV Infotech — Web Development Course Projects

This repository contains two projects built as part of the **Web Development Course at SARV Infotech**:

1. [Calculator App](#-1-calculator-app) — a simple calculator built using HTML, CSS, and JavaScript.
2. [AuraShop](#-2-aurashop--full-stack-e-commerce-web-application) — a full-stack e-commerce web application built using the MERN stack with Stripe payment integration.

---

## 🧮 1. Calculator App

A responsive, functional calculator built from scratch using core web technologies — no frameworks or libraries.

### Features
- Basic arithmetic operations: addition, subtraction, multiplication, division
- Clean, responsive UI that works on desktop and mobile
- Keyboard input support
- Clear (C) and delete (backspace) functionality
- Error handling for invalid expressions (e.g., divide by zero)

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Flexbox/Grid) |
| Logic | JavaScript (Vanilla JS) |

### Folder Structure
```
calculator/
├── index.html
├── style.css
└── script.js
```

### How to Run
1. Clone the repository.
2. Navigate to the `calculator` folder.
3. Open `index.html` directly in any web browser.

No installation or build step required.

---

## 🛒 2. AuraShop — Full-Stack E-Commerce Web Application

AuraShop is a full-stack e-commerce platform that lets users browse products, manage a cart, securely authenticate, and complete purchases through integrated Stripe payments.

### 🏗 Architecture

```
                     ┌────────────────────────────────┐
                     │   React Frontend (Vite SPA)     │
                     │  Tailwind CSS • Context API      │
                     └───────────────┬────────────────┘
                                     │ Axios (Bearer JWT)
                                     ▼
                     ┌────────────────────────────────┐
                     │     Node.js + Express REST      │
                     │      CORS • Auth • Stripe        │
                     └───────┬───────────────┬────────┘
                             │               │
                             ▼               ▼
                   ┌─────────────────┐ ┌───────────────┐
                   │  MongoDB Atlas  │ │ Stripe API /  │
                   │    (Mongoose)   │ │  Payment (PI) │
                   └─────────────────┘ └───────────────┘
```

The frontend (React + Vite) communicates with the backend (Node.js + Express) over a REST API secured with JWT Bearer tokens via Axios. The backend handles authentication, business logic, and Stripe payment processing, while persisting data in MongoDB Atlas using Mongoose.

### ✨ Features
- User authentication (Signup/Login) using JWT
- Product listing, search, and category filtering
- Shopping cart with persistent state via Context API
- Secure checkout and payments using Stripe (Payment Intents)
- Order history and order management
- Protected routes for authenticated users
- Fully responsive UI built with Tailwind CSS

### 🧰 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Context API (state management)
- Axios (API calls with JWT Bearer auth)

**Backend**
- Node.js
- Express.js
- CORS, JWT-based authentication
- Stripe API (Payment Intents)

**Database**
- MongoDB Atlas
- Mongoose (ODM)

### 📁 Folder Structure
```
AuraShop/
├── client/          # React frontend (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Node.js + Express backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

### ⚙️ Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### 🚀 How to Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/dhirajkumar-09/SARV-Infotech.git
cd SARV-Infotech
```

**2. Setup Backend**
```bash
cd server
npm install
npm start
```

**3. Setup Frontend**
```bash
cd client
npm install
npm run dev
```

**4. Open in Browser**
```
http://localhost:5173
```

---

## 👨‍💻 Author

**Dhiraj Kumar**
Web Development Course — SARV Infotech
GitHub: [dhirajkumar-09](https://github.com/dhirajkumar-09)

---

## 📄 License

This project is created for educational purposes as part of the SARV Infotech Web Development Course.

# AuraShop — Full-Stack E-Commerce Web Application

A modern, high-performance, and feature-rich full-stack e-commerce web platform built with **React (Vite + Tailwind CSS)** on the frontend and **Node.js + Express.js + MongoDB (Mongoose)** on the backend, featuring **JWT authentication**, **Stripe payment processing**, **persistent shopping cart**, and an **Admin inventory management panel**.

---

## Architecture & Tech Stack

```
                     ┌────────────────────────────────┐
                     │   React Frontend (Vite SPA)   │
                     │  Tailwind CSS • Context API    │
                     └───────────────┬────────────────┘
                                     │ Axios (Bearer JWT)
                                     ▼
                     ┌────────────────────────────────┐
                     │     Node.js + Express REST     │
                     │      CORS • Auth • Stripe      │
                     └───────┬───────────────┬────────┘
                             │               │
                             ▼               ▼
                   ┌─────────────────┐ ┌───────────────┐
                   │  MongoDB Atlas  │ │ Stripe API /  │
                   │    (Mongoose)   │ │  Payment (PI) │
                   └─────────────────┘ └───────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons, `@stripe/stripe-js`, `@stripe/react-stripe-js`
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `stripe`, `dotenv`, `cors`, `morgan`
- **Database**: MongoDB (Local or MongoDB Atlas free tier)
- **Payments**: Stripe Elements with `PaymentIntent` API + Test sandbox fallback mode

---

## Key Features

1. **User Authentication & Authorization**:
   - User signup and login with client and server-side validation.
   - Passwords hashed with `bcryptjs` (salt rounds: 10).
   - Signed JSON Web Tokens (JWT) stored in `localStorage` and sent via Axios request interceptors.
   - Protected customer routes (Checkout, Order Confirmation, Order History).
   - Role-based route protection (`admin` vs `user`).
   - One-click demo credential fill buttons for rapid testing.

2. **Product Browsing & Discovery**:
   - Product showcase with responsive grid, category tags, ratings, and stock status.
   - Real-time keyword search across names and descriptions.
   - Category filtering (Electronics, Laptops, Audio, Wearables, Accessories, Home).
   - Price range filter (Min & Max price inputs).
   - Multi-option sorting (Newest Arrivals, Price: Low to High, Price: High to Low, Highest Rated).
   - Dedicated Product Details view with image showcase, specs, and interactive quantity selectors.

3. **Shopping Cart with LocalStorage Persistence**:
   - Add to cart, update quantity (with stock limits), and remove items.
   - Cart automatically persists across browser refreshes and sessions.
   - Real-time cart badge counter in the navigation bar.
   - Automatic calculations for items subtotal, 8% tax, and shipping (Free shipping on orders over $100).

4. **Checkout & Stripe Payment**:
   - Multi-step checkout with delivery address collection.
   - Embedded Stripe Elements card payment form with 256-bit encryption.
   - Built-in sandbox mode with standard Stripe test cards (`4242 4242 4242 4242`).
   - Graceful mock fallback allowing complete end-to-end order placement even without a live Stripe key.
   - Orders recorded in MongoDB with timestamp, payment result, and automatic inventory stock deduction.
   - Dedicated Order Confirmation receipt page and Order History dashboard.

5. **Admin Inventory Dashboard**:
   - Protected admin view (`/admin`) accessible only to users with `role: "admin"`.
   - Real-time KPI metrics: Total Products, Units in Stock, and Total Inventory Value.
   - Product table with live filtering.
   - Full CRUD operations: Create new products, update existing products, and delete products with confirmation prompts.

---

## Project Structure

```
c:\Project2/
├── client/                     # Frontend React application (Vite)
│   ├── public/
│   │   └── _redirects          # SPA fallback rules for Netlify
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StripePaymentForm.jsx
│   │   ├── context/            # Global state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/              # Application pages
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── services/           # Axios API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── orderService.js
│   │   │   ├── paymentService.js
│   │   │   └── productService.js
│   │   ├── App.jsx             # Main Router layout
│   │   ├── index.css           # Tailwind base & utilities
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json             # SPA rewrite rules for Vercel
│   ├── .env.example
│   └── package.json
│
├── server/                     # Backend REST API (Node / Express)
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── controllers/            # Controller business logic
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── productController.js
│   ├── middleware/             # Express middlewares
│   │   ├── authMiddleware.js   # JWT verification & Admin guard
│   │   └── errorMiddleware.js  # Global error & 404 handlers
│   ├── models/                 # Mongoose schemas
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── productRoutes.js
│   ├── seeder.js               # Database population script
│   ├── server.js               # Server entry point & CORS
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root orchestration package.json
└── README.md                   # Full documentation & deployment guide
```

---

## Quick Start (Local Setup)

### Prerequisites
- **Node.js**: v18 or higher (v24 supported)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/ecommerce`) OR a free cloud connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Step 1: Clone or Navigate to Project
```bash
cd Project2
```

### Step 2: Configure Environment Variables

#### Backend (`/server/.env`)
Copy the example template:
```bash
cp server/.env.example server/.env
```
Ensure your `server/.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=supersecretjwtkey_change_in_production_12345
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
CLIENT_URL=http://localhost:5173
```
*(If you don't have a Stripe secret key yet, leave it as is — the server provides a built-in sandbox demo mode automatically).*

#### Frontend (`/client/.env`)
Copy the example template:
```bash
cp client/.env.example client/.env
```
Ensure your `client/.env` contains:
```env
VITE_API_URL=
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
```
*(In local development, `VITE_API_URL` can be left empty because the Vite proxy in `vite.config.js` forwards `/api` requests to `http://localhost:5000`).*

### Step 3: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 4: Seed the Database
Populate your MongoDB database with sample users and 12 rich products:
```bash
cd ../server
npm run seed
```
This creates:
- **Admin Account**: `admin@example.com` / `Admin123!`
- **Demo Customer**: `user@example.com` / `User123!`
- 12 products across Electronics, Audio, Laptops, Wearables, Accessories, and Home.

### Step 5: Start Development Servers

You can start both servers from the root or in separate terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## Testing Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin User** | `admin@example.com` | `Admin123!` | Full store access + `/admin` Product CRUD dashboard |
| **Demo Customer** | `user@example.com` | `User123!` | Product browsing, cart, checkout, order history |

> **Pro-Tip**: On the `/login` page, you can click the **Customer** or **Admin** quick-fill buttons to populate credentials with a single click.

---

## Testing Stripe Payments

When testing payments on `/checkout`:
1. Use any test credit card supported by Stripe sandbox:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiration**: Any future date (e.g. `12/28`)
   - **CVC**: Any 3 digits (e.g. `123`)
   - **ZIP Code**: Any valid postal code (e.g. `94105`)
2. If running without a Stripe key configured, the application runs in **Stripe Sandbox Demo Mode** — clicking **Pay Securely** immediately simulates authorization and creates the order in MongoDB.

---

## Free-Tier Deployment Guide

Deploying AuraShop completely free using:
- **Database**: MongoDB Atlas Free Shared Cluster (M0)
- **Backend API**: Render or Railway (Free Tier)
- **Frontend SPA**: Vercel or Netlify (Free Tier)

---

### 1. Database Setup: MongoDB Atlas (Free Tier)

1. Sign up or log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (**M0 Sandbox**).
3. Under **Database Access**, create a database user (e.g. username `dbUser`, strong password).
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)** so your hosted backend can connect.
5. Click **Connect** > **Drivers** (Node.js) and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials.

---

### 2. Backend Deployment: Render (Free Web Service)

1. Push your repository to GitHub.
2. Sign up or log in at [Render.com](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name**: `aurashop-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add **Environment Variables** in Render's dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ecommerce?retryWrites=true&w=majority`
   - `JWT_SECRET`: `a_very_long_secure_random_string_32_characters_or_more`
   - `JWT_EXPIRE`: `30d`
   - `STRIPE_SECRET_KEY`: `sk_test_your_real_stripe_secret_key`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app` (update once frontend is deployed)
7. Click **Deploy Web Service**.
8. After deployment, copy your Render service URL (e.g. `https://aurashop-api.onrender.com`).
9. *(Optional)* Seed remote database: In Render's **Shell** tab, run `node seeder.js`.

---

### 3. Frontend Deployment: Vercel (Recommended)

1. Sign up or log in at [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project** and import your GitHub repository.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `client`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://aurashop-api.onrender.com` (Your deployed Render backend URL, without trailing slash)
   - `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_test_your_real_stripe_publishable_key`
5. Click **Deploy**.
6. `vercel.json` included in `/client` ensures all client-side routes (`/checkout`, `/orders`, etc.) route properly through `index.html`.
7. Once deployed, copy your Vercel URL and update `CLIENT_URL` in your Render backend environment variables to permit CORS!

---

### Alternative Frontend: Netlify

1. Log in at [Netlify.com](https://www.netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Choose your GitHub repository.
4. Settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Under **Environment variables**, add:
   - `VITE_API_URL`: `https://aurashop-api.onrender.com`
   - `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_test_...`
6. Netlify automatically detects `client/public/_redirects` to handle client-side routing.

---

## API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register new user account.
- `POST /api/auth/login` — Sign in with credentials and receive JWT.
- `GET /api/auth/me` — Protected endpoint returning current user profile.

### Products (`/api/products`)
- `GET /api/products` — Retrieve products with query params:
  - `keyword`: Search name/description
  - `category`: Category filter
  - `minPrice` & `maxPrice`: Price range filter
  - `sortBy`: `newest`, `price_asc`, `price_desc`, `rating`
  - `page` & `limit`: Pagination
- `GET /api/products/categories` — Get list of distinct product categories.
- `GET /api/products/:id` — Get single product details.
- `POST /api/products` — (Admin) Create a new product.
- `PUT /api/products/:id` — (Admin) Update product details/stock.
- `DELETE /api/products/:id` — (Admin) Delete a product.

### Payment (`/api/payment`)
- `GET /api/payment/config` — Get Stripe publishable key configuration.
- `POST /api/payment/create-payment-intent` — (Protected) Create Stripe `PaymentIntent`.

### Orders (`/api/orders`)
- `POST /api/orders` — (Protected) Create order after payment.
- `GET /api/orders/myorders` — (Protected) Get customer's past orders.
- `GET /api/orders/:id` — (Protected) Get order by ID (customer or admin).
- `GET /api/orders` — (Admin) Get all orders across the store.
- `PUT /api/orders/:id/deliver` — (Admin) Mark order as delivered.

---

## License & Contributing
Built as a complete open-source full-stack e-commerce solution. Feel free to customize, extend, and deploy!

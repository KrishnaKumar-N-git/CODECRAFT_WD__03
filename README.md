# 🛒 APK Grocery Stores

A modern **full-stack grocery e-commerce website** built using the **MERN Stack**.

APK Grocery Stores allows customers to browse grocery products, add products to their cart, place orders, make online payments, and track their orders.

The project also includes an **Admin Dashboard** where store owners can manage products, orders, users, payments, and sales information.

---

## 🚀 Main Features

### 👤 Customer Features

* 🔍 Search for grocery products
* 📂 Browse products by category
* 🛒 Add products to cart
* ❤️ Add products to wishlist
* 📦 Place grocery orders
* 🏠 Save delivery addresses
* 🚚 Choose home delivery or store pickup
* 💳 Pay using UPI, Razorpay, or Cash on Delivery
* 📍 Track order status
* ⭐ Give product ratings and reviews

### 👨‍💼 Admin Features

* 📊 View sales and revenue dashboard
* ➕ Add new products
* ✏️ Edit product details
* 🗑️ Delete products
* 🖼️ Upload product images
* 📂 Manage product categories
* 📦 Manage customer orders
* 🚚 Update order status
* 👥 Manage users
* 💰 View sales information
* 📱 Configure UPI payment details

---

## 💳 Payment Options

The application supports multiple payment methods:

* 📱 UPI QR Payment
* 💳 Razorpay
* 💵 Cash on Delivery

Razorpay integration is optional and can be configured using environment variables.

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* React Hook Form
* Recharts
* Axios
* Lucide React
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Zod Validation
* Multer
* Helmet
* Express Rate Limit

### Cloud Services

* MongoDB Atlas – Database
* Cloudinary – Product image storage
* Razorpay – Online payments

---

## 🏗️ How the Project Works

```text
Customer
   ↓
React Website
   ↓
Express REST API
   ↓
Authentication & Validation
   ↓
MongoDB Database
   ↓
Cloudinary / Razorpay
```

### Simple Flow

1. Customer opens the website.
2. Customer searches or browses products.
3. Customer adds products to the cart.
4. Customer enters the delivery address.
5. Customer selects a payment method.
6. Customer places the order.
7. Admin receives the order.
8. Admin updates the order status.
9. Customer tracks the order until delivery.

---

## 📁 Project Structure

```text
apk-grocery/
│
├── client/                  # React Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   └── store/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/                  # Node.js + Express Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── validators/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── package.json
└── render.yaml
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/apk-grocery.git
```

Go into the project folder:

```bash
cd apk-grocery
```

---

## 2. Install Dependencies

Run:

```bash
npm run postinstall
```

This installs the dependencies for both the frontend and backend.

---

## 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/apk_grocery_db

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ⚠️ Never upload your real `.env` file or secret keys to GitHub.

---

## 4. Start the Project

Run:

```bash
npm run dev
```

The application will start in development mode.

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

# 🌱 Database Seeding

You can add sample data to MongoDB using:

```bash
npm run seed
```

This creates sample:

* Categories
* Grocery products
* Users
* Stores
* Addresses
* Orders

---

# 🔐 Demo Login

After running the seed command, you can use the demo accounts.

| Role           | Email                      | Password       |
| -------------- | -------------------------- | -------------- |
| 👑 Admin       | `admin@apkgrocery.demo`    | `Admin@123`    |
| 🏪 Store Owner | `owner@apkgrocery.demo`    | `Owner@123`    |
| 🛒 Customer    | `customer@apkgrocery.demo` | `Customer@123` |

> **Security:** Change demo passwords before using the project in production.

---

# 📜 Available Commands

| Command          | What it does                |
| ---------------- | --------------------------- |
| `npm run dev`    | Starts frontend and backend |
| `npm run server` | Starts backend              |
| `npm run client` | Starts frontend             |
| `npm run seed`   | Adds sample data            |
| `npm run build`  | Builds the frontend         |
| `npm start`      | Starts production server    |

---

# 🔌 API Overview

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## Products

```text
GET /api/products
GET /api/products/:slug
GET /api/categories
```

## Cart & Orders

```text
GET  /api/cart
POST /api/cart

POST /api/orders
GET  /api/orders/my-orders
```

## Addresses

```text
GET  /api/addresses
POST /api/addresses
```

## Admin

```text
GET  /api/admin/dashboard
POST /api/admin/products
PUT  /api/admin/orders/:id/status
```

---

# ☁️ Deployment

The project is configured for deployment using **Render**.

Basic deployment flow:

```text
GitHub
   ↓
Render
   ↓
Build Project
   ↓
Start Server
   ↓
Live Website
```

The project includes:

```text
render.yaml
```

which helps configure the deployment.

---

# 🔒 Security

The application includes:

* 🔐 JWT authentication
* 👥 Role-based access control
* 🔑 Password hashing with Bcrypt
* 🛡️ Helmet security headers
* 🚦 Rate limiting
* ✅ Zod validation
* 🌐 CORS configuration

---

# 📱 Responsive Design

The website is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

---

# 🎯 Project Goal

The main goal of **APK Grocery Stores** is to provide a simple and complete online shopping platform for a local grocery store.

Customers can easily:

**Browse → Add to Cart → Checkout → Pay → Track Order**

while the store owner can:

**Manage Products → Manage Orders → Manage Customers → View Sales**

---

# 👨‍💻 Author

**APK Grocery Stores**

Built with ❤️ using the MERN Stack.

---

## 📄 License

This project is licensed under the **ISC License**.

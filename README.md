# 🪙 Crypto Historical 365 Days Analytics

A robust, high-performance cryptocurrency historical data tracking and analysis platform built on the **MERN (MongoDB, Express.js, React, Node.js) stack**. This application provides comprehensive visualization, analytics, and an extensive API for single and bulk CRUD operations, advanced historical data filtering, and market performance metrics.

---

## 🔗 Live Links

- **Frontend Application**: [Live Demo](https://crypto-historical-365days-hemang-si.vercel.app/)
- **Backend API Server**: [Live Server](https://crypto-historical-365days.onrender.com)
- **Comprehensive API Documentation**: [Postman Docs](https://documenter.getpostman.com/view/50840788/2sBXwpQCSu)

---

## 🚀 Key Features

### Frontend (Client)
*   **Interactive Dashboards**: Beautiful, dynamic charts using Recharts for visualizing 365 days of crypto historical data.
*   **Modern UI/UX**: Built with Framer Motion for smooth micro-animations and page transitions.
*   **Responsive Design**: A sleek, premium dark-mode tailored interface built with vanilla CSS and custom components.
*   **Real-time Insights**: View daily returns, rolling moving averages, volatility metrics, and cumulative returns.

### Backend (API)
*   **Standard MVC Architecture**: Clean code organization separated into Models, Controllers, Services, and Routes.
*   **High-Performance Bulk Operations**: Optimized database operations utilizing MongoDB's native `insertMany`, `bulkWrite`, and `deleteMany`.
*   **Rich Querying and Filtering**: Query by coin name, symbol, rank, month, or specific calendar date.
*   **Intelligent Route Matching**: Carefully structured route hierarchy preventing parameter conflicts.
*   **Authentication & Security**: Integrated JWT authentication and role-based access control.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 19 (via Vite)
*   **Routing**: React Router DOM
*   **Animations**: Framer Motion
*   **Charts**: Recharts
*   **Icons**: Lucide React
*   **HTTP Client**: Axios
*   **Styling**: Vanilla CSS

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB Atlas (Cloud)
*   **Object Modeling**: Mongoose
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **Security & Config**: CORS, Dotenv

---

## 📂 Project Directory Structure

```text
├── backend/
│   ├── config/             # Database connection setups
│   ├── controllers/        # Request handling and response generation
│   ├── models/             # Mongoose Schemas & Data modeling
│   ├── routes/             # RESTful API route mapping
│   ├── services/           # DB query abstractions & business logic
│   ├── scripts/            # Database seeding scripts
│   ├── .env                # App configuration & environment keys
│   └── server.js           # Server initializer and middleware pipeline
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views/pages
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # React DOM rendering
│   └── package.json        # Frontend dependencies
├── README.md               # Project Documentation
```

---

## ⚙️ Installation & Configuration

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your system.

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crypto
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if necessary) for API URL configuration:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 📖 API Documentation & Route Reference

For full API documentation with request/response examples, please visit the **[Postman Documentation](https://documenter.getpostman.com/view/50840788/2sBXwpQCSu)**.

*All routes are prefixed with `/coins`.*

### Core Endpoints Overview

| Category | Endpoints Example | Description |
| :--- | :--- | :--- |
| **Standard CRUD** | `GET /coins`, `POST /coins`, `GET /coins/:id` | Fetch, create, update, or delete single records. |
| **Bulk Operations** | `POST /coins/bulk-create`, `PATCH /coins/bulk-update` | Execute operations on multiple records efficiently. |
| **Identity Filters** | `GET /coins/name/:name`, `GET /coins/symbol/:symbol` | Search by specific coin attributes. |
| **Time Filters** | `GET /coins/month/:month`, `GET /coins/date/:date` | Retrieve historical data by timeframe. |
| **Market Standings** | `GET /coins/top-gainers`, `GET /coins/top-market-cap` | Fetch rankings based on market metrics. |
| **Analytics** | `GET /coins/performance/:coinId` | Fetch a full performance dashboard (volatility, moving averages, etc.). |

---

## 👨‍💻 Author

**Hemang Singh Solanki**
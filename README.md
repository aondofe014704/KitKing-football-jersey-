# KitKing — Premium Football Jersey E-Commerce Platform

A world-class, production-ready football jersey e-commerce platform built with Next.js, Express.js, PostgreSQL, and Prisma.

## 🏗️ Project Structure

```
jerseys/
├── frontend/          # Next.js 14 App Router (React + TypeScript + Tailwind)
├── backend/           # Express.js REST API (TypeScript + Prisma + PostgreSQL)
├── shared/            # Shared TypeScript types
└── package.json       # Root workspace config
```

## ⚡ Tech Stack

### Frontend
- **Next.js 14** (App Router) + React 18
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **TanStack Query** — Server state management
- **Zustand** — Client state (auth, cart, wishlist)
- **React Hook Form + Zod** — Form validation
- **Lucide React** — Icons

### Backend
- **Express.js** — REST API
- **Prisma ORM** + **PostgreSQL**
- **JWT** — Authentication with refresh tokens
- **Bcrypt** — Password hashing
- **Paystack + Flutterwave** — Payment gateways
- **Cloudinary** — Image storage
- **Helmet + CORS + Rate Limiting** — Security

## 📁 Pages Built

### Customer-Facing
| Page | Path |
|------|------|
| Home | `/` |
| Shop | `/shop` |
| Product Detail | `/shop/[slug]` |
| Categories | `/categories` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Wishlist | `/wishlist` |
| Track Order | `/track-order` |
| Login | `/login` |
| Register | `/register` |
| Dashboard | `/dashboard` |
| Orders | `/dashboard/orders` |
| Wishlist | `/dashboard/wishlist` |
| Addresses | `/dashboard/addresses` |
| Profile | `/dashboard/profile` |
| Gallery | `/gallery` |
| About | `/about` |
| Our Store | `/our-store` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Privacy Policy | `/privacy-policy` |
| Terms | `/terms` |
| Returns | `/returns` |
| 404 | `/not-found` |

### Admin Panel (`/admin`)
| Page | Path |
|------|------|
| Dashboard | `/admin` |
| Analytics | `/admin/analytics` |
| Products | `/admin/products` |
| Add Product | `/admin/products/new` |
| Categories | `/admin/categories` |
| Orders | `/admin/orders` |
| Customers | `/admin/customers` |
| Reviews | `/admin/reviews` |
| Coupons | `/admin/coupons` |
| Gallery | `/admin/gallery` |
| Blog | `/admin/blog` |
| Delivery Zones | `/admin/delivery` |
| Settings | `/admin/settings` |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### 1. Clone & Install
```bash
# Install all workspace dependencies
npm install
```

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env`:
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/kitking_db"
JWT_ACCESS_SECRET=your_super_secret_access_key_at_least_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_at_least_32_chars
PAYSTACK_SECRET_KEY=sk_test_your_key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** — copy `.env.example` to `.env.local`:
```bash
cd frontend
copy .env.example .env.local
```

### 3. Setup Database
```bash
# Create and migrate the database
npm run db:migrate

# Seed with demo data (products, admin user, coupons, delivery zones)
npm run db:seed
```

### 4. Start Development
```bash
# Run both frontend and backend simultaneously
npm run dev

# Or individually:
npm run dev:frontend    # http://localhost:3000
npm run dev:backend     # http://localhost:5000
```

## 🔐 Default Credentials

After seeding:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@kitking.ng | Admin@KitKing2025 |
| Demo Customer | customer@kitking.ng | Customer@123 |

**Demo Coupon Codes:** `WELCOME10` (10% off), `SAVE2000` (₦2,000 off)

## 💳 Payment Setup

### Paystack
1. Create account at [paystack.com](https://paystack.com)
2. Get test keys from Dashboard → Settings → API Keys
3. Add to `.env`: `PAYSTACK_SECRET_KEY=sk_test_...`

### Flutterwave
1. Create account at [flutterwave.com](https://flutterwave.com)
2. Get test keys from Dashboard → Settings → API
3. Add to `.env`: `FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...`

## 🖼️ Image Upload (Cloudinary)
1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret from Dashboard
3. Add to backend `.env`

## 📊 Database Schema
Key models: User, Product, Category, Order, OrderItem, CartItem, WishlistItem, Review, Coupon, GalleryImage, BlogPost, DeliveryZone, Setting

## 🏗️ Build for Production
```bash
npm run build
npm start
```

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| GET | `/products` | Get all products |
| GET | `/products/:slug` | Get product by slug |
| GET | `/categories` | Get categories |
| GET | `/cart` | Get cart |
| POST | `/cart` | Add to cart |
| GET | `/orders/my` | Get my orders |
| POST | `/orders` | Create order |
| GET | `/orders/track/:number` | Track order |
| POST | `/payments/paystack/initialize` | Init Paystack payment |
| GET | `/admin/dashboard` | Admin dashboard stats |

## 📝 Brand
- **Name:** KitKing
- **Tagline:** Premium Football Jerseys
- **Colors:** Deep Green (#0A4A2F), Gold (#C9A84C), Black (#0D0D0D), White (#FAFAFA)
- **Fonts:** Bebas Neue (display), Inter (body)

---

Built with ⚽ and ❤️ for Nigerian football fans.

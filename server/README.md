# CAPS Resources Backend API

Complete backend system for CAPS Resources educational materials website with payment processing, user authentication, and PDF delivery.

## Features

✅ **User Authentication** - JWT-based auth with bcrypt password hashing
✅ **Payment Gateway** - PayFast integration for South African payments  
✅ **Database** - MongoDB with Mongoose ODM
✅ **PDF Delivery** - Secure download links with expiry and limits
✅ **Email Notifications** - Automated purchase confirmations with nodemailer
✅ **Order Management** - Complete order tracking and history

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# MongoDB - Local or MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/caps-resources

# JWT Secret (generate a strong random string)
JWT_SECRET=your_secret_key_minimum_32_characters_long

# PayFast Configuration
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_secure_passphrase
PAYFAST_SANDBOX=true

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

### 4. Create Storage Directory

```bash
mkdir -p storage/pdfs
```

### 5. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Get Profile**
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Products

**Get All Products**
```http
GET /api/products?grade=grade1&subject=Mathematics
```

**Get Single Product**
```http
GET /api/products/:id
```

**Create Product** (Admin only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Grade 1 Math Worksheets",
  "description": "Comprehensive math worksheets for Grade 1",
  "grade": "grade1",
  "subject": "Mathematics",
  "price": 49.99,
  "pdfFileName": "grade1-math-worksheets.pdf",
  "category": "worksheets",
  "pages": 50
}
```

### Orders

**Create Order**
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": ["product_id_1", "product_id_2"]
}
```

**Get User Orders**
```http
GET /api/orders/user
Authorization: Bearer <token>
```

**Get Order Details**
```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

### Downloads

**Download PDF**
```http
GET /api/download/:token
```

## PayFast Integration

### Test Credentials (Sandbox)

- Merchant ID: `10000100`
- Merchant Key: `46f0cd694581a`
- Passphrase: `jt7NOE43FZPn`

### Test Cards

**Successful Payment:**
- Card Number: `4000000000000002`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000000000000010`

### Production Setup

1. Register at https://www.payfast.co.za
2. Get your merchant credentials
3. Update .env with production credentials
4. Set `PAYFAST_SANDBOX=false`
5. Configure return and notify URLs in PayFast dashboard

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use the generated password in EMAIL_PASSWORD

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'educator', 'admin'],
  purchases: [{ product, purchaseDate, downloadCount }],
  createdAt: Date
}
```

### Product Model
```javascript
{
  title: String,
  description: String,
  grade: String,
  subject: String,
  price: Number,
  pdfFileName: String,
  fileSize: String,
  pages: Number,
  category: String,
  downloads: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId,
  items: [{ product, price }],
  totalAmount: Number,
  paymentStatus: String,
  paymentMethod: String,
  paymentId: String,
  downloadLinks: [{ product, token, expiresAt, downloads }],
  emailSent: Boolean,
  createdAt: Date
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Payment signature verification
- ✅ Download token expiry (72 hours)
- ✅ Download limit enforcement (5 downloads)
- ✅ Admin role-based access control
- ✅ CORS protection
- ✅ Input validation

## Frontend Integration

Update your frontend to use these APIs:

```javascript
// Example: Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Example: Create Order
const createOrder = async (productIds) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items: productIds })
  });
  return await response.json();
};
```

## Deployment

### Heroku
```bash
heroku create caps-resources-api
heroku addons:create mongolab
heroku config:set JWT_SECRET=your_secret
heroku config:set PAYFAST_MERCHANT_ID=your_id
# ... set other environment variables
git push heroku main
```

### DigitalOcean / AWS
1. Set up Node.js server
2. Install MongoDB or use MongoDB Atlas
3. Configure environment variables
4. Set up SSL certificate
5. Configure domain and firewall

## Support

For issues or questions:
- Email: support@capsresources.co.za
- GitHub: [Repository Issues](https://github.com/MusawenkosiMagagula/caps-resources-website/issues)

## License

Private - All Rights Reserved

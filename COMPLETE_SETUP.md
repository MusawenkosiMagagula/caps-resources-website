# Complete Setup Guide - CAPS Resources Website

Comprehensive setup instructions for the CAPS Resources educational platform with frontend, backend, database, and document organization.

## What's Included

✅ **Frontend** - Beautiful, responsive HTML/CSS/JavaScript interface
✅ **Backend** - Node.js/Express API with authentication & payment processing
✅ **Database** - MongoDB for users, products, and orders
✅ **Payment Gateway** - PayFast integration for South African market
✅ **Smart Document Organization** - Python scripts to categorize documents automatically
✅ **Multi-Format Support** - PDF, Word, Excel, PowerPoint all supported

## System Requirements

- **Node.js** v14+ (for backend server)
- **MongoDB** v4.4+ (local or MongoDB Atlas)
- **Python** v3.8+ (for document organization scripts)
- **Git** (for version control)
- Internet connection for PayFast payment processing

---

## Part 1: Frontend Setup (5 minutes)

The frontend is ready to use immediately!

### Files Included
- `index.html` - Main landing page with grade/subject selection
- `styles.css` - Responsive design with animations
- `script.js` - Interactive modals and functionality
- `images/` - Hero section background images

### Deploy to GitHub Pages
```bash
# Already configured! Your site is live at:
# https://<your-github-username>.github.io/caps-resources-website
```

### Test Locally
```powershell
# Option 1: Just open index.html in a browser

# Option 2: Start a local server
cd C:\caps-resources-website
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## Part 2: Backend Setup (15 minutes)

### 2.1 Install Node.js

Download and install from: https://nodejs.org/ (LTS version recommended)

### 2.2 Install Backend Dependencies

```powershell
cd C:\caps-resources-website\server
npm install
```

### 2.3 Configure Environment Variables

Create a `.env` file in the `server` folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/caps-resources

# JWT Authentication
JWT_SECRET=your-secret-key-change-this-in-production

# PayFast (South African Payment Gateway)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f1db3175859ac3c
PAYFAST_PASSPHRASE=test-passphrase
PAYFAST_MODE=sandbox

# Email (for purchase confirmations)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@capsresources.co.za

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Environment
NODE_ENV=development
PORT=5000
```

**Important:** Change `JWT_SECRET` and email credentials in production!

### 2.4 Start Backend Server

```powershell
cd C:\caps-resources-website\server
npm run dev
```

Expected output:
```
✓ MongoDB connected
✓ Server running on http://localhost:5000
```

### 2.5 Verify API (Optional)

```powershell
# Test the health endpoint
curl http://localhost:5000/health
# Response should be: {"status":"ok"}
```

---

## Part 3: Database Setup (10 minutes)

### 3.1 Install MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow wizard
3. Choose "Install MongoDB as a Service"

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3.2 Verify MongoDB is Running

```powershell
mongosh
# Should open MongoDB shell
exit
```

### 3.3 Database Collections (Auto-Created)

The server automatically creates these collections:

1. **users** - User accounts with purchase history
2. **products** - Educational resources catalog
3. **orders** - Payment orders and download tracking

---

## Part 4: Organize and Import Documents (20 minutes)

This is where the magic happens! Your documents are automatically organized and categorized.

### 4.1 Install Python

Download and install from: https://www.python.org/ (version 3.8+)

Make sure to check "Add Python to PATH" during installation!

### 4.2 Install Python Dependencies

```powershell
cd C:\caps-resources-website\scripts
pip install -r requirements.txt
```

If pip doesn't work, try:
```powershell
python -m pip install -r requirements.txt
```

### 4.3 Prepare Your Documents

Move all your educational resources to the `Website` folder:

**Path:**
```
C:\caps-resources-website\Website\
```

**Supported Formats:**
- PDF (.pdf)
- Word (.docx, .doc)
- Excel (.xlsx, .xls)
- PowerPoint (.pptx, .ppt)

**Important:** Don't worry about file names! The script reads the actual document content!

Example:
```
Website/
├── mathematics_grade4.pdf
├── english grade 7.docx
├── science worksheets.xlsx
├── random_name_123.pdf
└── asdfgh_presentation.pptx
```

All of these will be properly organized!

### 4.4 Run Organization Script

```powershell
cd C:\caps-resources-website\scripts
python organize_pdfs.py
```

This will:
- ✅ Scan all documents in the Website folder
- ✅ Read the content of EVERY document (not just the filename)
- ✅ Extract: Grade, Subject, Type, Year
- ✅ Rename: `grade-subject-type-year.extension`
- ✅ Organize: Into folders by grade/subject
- ✅ Create: `_organization_results.json` with all details

**Example Output Structure:**
```
server/storage/pdfs/
├── grade1/
│   ├── Mathematics/
│   │   ├── grade1-mathematics-worksheets-2024.pdf
│   │   └── grade1-mathematics-assessments-2024.docx
│   └── English/
│       └── grade1-english-study-guides-2024.xlsx
│
├── grade7/
│   ├── Natural-Sciences/
│   │   └── grade7-natural-sciences-lesson-plans-2024.pptx
│   └── Mathematics/
│       └── grade7-mathematics-worksheets-2024.pdf
│
└── _organization_results.json
```

### 4.5 Review Organization Results

```powershell
# Open the results file
notepad "C:\caps-resources-website\server\storage\pdfs\_organization_results.json"
```

Check that:
- ✅ All documents were found
- ✅ Grades are correct
- ✅ Subjects are correctly identified
- ✅ Document types are accurate
- ✅ Years are extracted

If something is wrong, you can:
1. Edit the JSON file manually
2. Run import script again

### 4.6 Import to Database

```powershell
cd C:\caps-resources-website\scripts
python import_to_database.py
```

Expected output:
```
Database Import Summary:
├─ Imported: 47 new products
├─ Skipped: 3 duplicates
├─ Total Products: 50
├─ Grades: Preschool, Grade 1, Grade 4, Grade 7, Grade 10, Grade 12
├─ Subjects: Mathematics (12), English (8), Natural Sciences (10), Life Skills (7), Physical Sciences (6), Other (7)
├─ File Types: PDF (35), WORD (8), EXCEL (4), POWERPOINT (3)
└─ Price Range: R29.99 - R89.99
```

This will:
- ✅ Read the organization results
- ✅ Create product entries in MongoDB
- ✅ Set appropriate prices by grade level
- ✅ Generate titles and descriptions
- ✅ Track file types in database
- ✅ Skip any duplicates

---

## Smart Content Detection Example

The script is intelligent about document naming:

### Before Organization

```
Website/
├── asdfgh_2024.pdf
├── random123.docx
├── test_file.xlsx
└── zzz_presentation.pptx
```

### Content Analysis

The script reads the actual content:

1. **asdfgh_2024.pdf**
   - Content: "Grade 7 Mathematics... worksheets... problem solving..."
   - Detected: Grade 7, Mathematics, Worksheets

2. **random123.docx**
   - Content: "Grade 1 English Assessment... comprehension..."
   - Detected: Grade 1, English, Assessments

3. **test_file.xlsx**
   - Content: "Grade 4 Life Skills Activity... healthy living..."
   - Detected: Grade 4, Life Skills, Activities

4. **zzz_presentation.pptx**
   - Content: "Grade 9 Physical Sciences Lesson Plan..."
   - Detected: Grade 9, Physical Sciences, Lesson Plans

### After Organization

```
server/storage/pdfs/
├── grade1/
│   └── English/
│       └── grade1-english-assessments-2024.docx
│
├── grade4/
│   └── Life-Skills/
│       └── grade4-life-skills-activities-2024.xlsx
│
├── grade7/
│   └── Mathematics/
│       └── grade7-mathematics-worksheets-2024.pdf
│
└── grade9/
    └── Physical-Sciences/
        └── grade9-physical-sciences-lesson-plans-2024.pptx
```

---

## Part 5: Connect Frontend to Backend (10 minutes)

Update `script.js` to fetch products from the backend API:

### 5.1 Update API Base URL

In `script.js`, ensure the API base URL is configured:

```javascript
const API_BASE_URL = 'http://localhost:5000';
```

### 5.2 Add API Calls (Example)

```javascript
// Fetch all products by grade
async function loadProductsByGrade(grade) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products?grade=${grade}`
    );
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

// Add product to cart and create order
async function addToCart(productIds) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        products: productIds,
        userEmail: 'customer@example.com'
      })
    });
    const order = await response.json();
    redirectToPayment(order);
  } catch (error) {
    console.error('Failed to create order:', error);
  }
}
```

---

## Part 6: Test Payment Flow (Optional)

### Use Test Credentials

PayFast Sandbox Mode is enabled in `.env`:
```
PAYFAST_MODE=sandbox
PAYFAST_MERCHANT_ID=10000100
```

### Test Payment Card Details
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Amount:** Any amount

### Test Flow
1. Open the website locally
2. Select a grade and subject
3. Add product to cart
4. Proceed to checkout
5. Use test card details above
6. Should see success page

---

## Supported Grades & Subjects

### All CAPS Grades
- Preschool, Reception
- Grade 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

### Supported Subjects
- Mathematics, Mathematical Literacy
- English (Home Language, First Additional Language)
- Afrikaans (Home Language, First Additional Language)
- Life Skills, Life Orientation
- Natural Sciences, Physical Sciences, Life Sciences
- Social Sciences
- Accounting, Business Studies, Economics
- Technology, Computer Applications Technology
- Creative Arts

### Resource Types
- Worksheets
- Assessments / Tests
- Lesson Plans
- Activities
- Study Guides

### Supported File Formats
- **PDF** (.pdf)
- **Word** (.doc, .docx)
- **Excel** (.xls, .xlsx)
- **PowerPoint** (.ppt, .pptx)

---

## Project Structure

```
C:\caps-resources-website\
│
├── index.html                 # Frontend landing page
├── script.js                  # Frontend JavaScript
├── styles.css                 # Frontend styles
├── images/                    # Hero section images
│   └── elnaz-asadi-...jpg     # Background image
│
├── server/                    # Backend Node.js app
│   ├── server.js              # Express server entry point
│   ├── package.json           # Node dependencies
│   ├── .env                   # Configuration (create this)
│   ├── .env.example           # Configuration template
│   ├── storage/
│   │   └── pdfs/              # Organized documents stored here
│   ├── models/                # Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   └── orderController.js
│   ├── services/              # Helper functions
│   │   ├── paymentService.js
│   │   └── pdfService.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── download.js
│   └── README.md              # Backend documentation
│
├── scripts/                   # Python automation
│   ├── organize_pdfs.py       # Document organization
│   ├── import_to_database.py  # Database import
│   ├── requirements.txt       # Python dependencies
│   ├── run_organization.bat   # Windows batch runner
│   └── README.md              # Script documentation
│
├── Website/                   # Your documents here
│
├── COMPLETE_SETUP.md          # This complete guide
├── QUICK_SETUP.md             # Original quick guide
└── README.md                  # Project overview
```

---

## Troubleshooting

### MongoDB Connection Failed

```powershell
# Check if MongoDB is running
mongosh

# If connection fails, start MongoDB:
# Windows Service: net start MongoDB
# Or check Services app and start MongoDB Community Server
```

### Python Dependencies Error

```powershell
cd C:\caps-resources-website\scripts

# Try installing with explicit Python module
python -m pip install -r requirements.txt

# Or with pip3
pip3 install -r requirements.txt

# Verify specific packages
python -c "import PyPDF2; import docx; import openpyxl; import pptx; print('All packages OK')"
```

### Cannot Extract Document Content

- Ensure document is not password protected
- Ensure document has readable text (not scanned image only)
- Check file format is correct (.pdf, .docx, .xlsx, .pptx)
- Try opening the file manually in appropriate application
- Check for file corruption

### API Not Responding

```powershell
# Check if backend server is running
curl http://localhost:5000/health

# If not, start it:
cd C:\caps-resources-website\server
npm run dev

# Check if port 5000 is already in use
netstat -ano | findstr :5000
```

### Products Not Importing

1. Verify MongoDB is running: `mongosh`
2. Check that `_organization_results.json` exists
3. Verify documents were organized: Check `server/storage/pdfs/`
4. Check error messages in console
5. Try importing again: `python import_to_database.py`

### Products Not Showing in Database

```powershell
# Connect to MongoDB
mongosh

# Check database and collection
> db.products.countDocuments()
# Should return > 0

# View first product
> db.products.findOne()

# View all products by grade
> db.products.find({ grade: 'grade7' })

exit
```

---

## Pricing Structure

Default pricing by grade:
- **Preschool/Reception:** R29.99 - R34.99
- **Grade 1-3:** R39.99
- **Grade 4-6:** R49.99
- **Grade 7-9:** R59.99
- **Grade 10-12:** R79.99 - R89.99

To customize pricing, edit `scripts/import_to_database.py`:

```python
PRICE_MAP = {
    'preschool': 29.99,
    'reception': 34.99,
    'grade1': 39.99,
    'grade2': 39.99,
    'grade3': 39.99,
    'grade4': 49.99,
    # ... etc
}
```

Then re-import:
```powershell
# Delete existing products (optional)
# Then run: python import_to_database.py
```

---

## Detailed API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (requires token)
```

### Products
```
GET /api/products
GET /api/products?grade=grade7
GET /api/products?subject=Mathematics
GET /api/products?search=worksheets
```

### Orders & Payment
```
POST /api/orders (create order)
GET /api/orders (get user's orders)
POST /api/orders/webhook (PayFast webhook)
```

### Downloads
```
GET /api/download/:token (download PDF)
```

See `server/README.md` for complete API documentation.

---

## Next Steps Checklist

### Immediate (Now)
- [ ] Install Node.js from nodejs.org
- [ ] Install MongoDB from mongodb.com
- [ ] Install Python from python.org
- [ ] Clone or download repository

### Step 1: Backend (15 min)
- [ ] Run `npm install` in server folder
- [ ] Create `.env` file with credentials
- [ ] Start MongoDB (`mongod` or service)
- [ ] Run `npm run dev` to start backend

### Step 2: Documents (20 min)
- [ ] Move documents to Website folder
- [ ] Install Python deps: `pip install -r requirements.txt`
- [ ] Run organization script: `python organize_pdfs.py`
- [ ] Review `_organization_results.json`
- [ ] Run import script: `python import_to_database.py`

### Step 3: Frontend (10 min)
- [ ] Test locally: Open `index.html` in browser
- [ ] Connect to backend APIs (update script.js)
- [ ] Test product loading
- [ ] Test purchase flow with test card

### Step 4: Production (Later)
- [ ] Configure production PayFast credentials
- [ ] Deploy backend to production server
- [ ] Set up MongoDB Atlas for production
- [ ] Configure SSL certificate
- [ ] Update frontend URLs
- [ ] Deploy frontend to GitHub Pages

---

## Environment Variables Reference

### `.env` File Template

```env
# =========================
# DATABASE
# =========================
MONGODB_URI=mongodb://localhost:27017/caps-resources

# =========================
# AUTHENTICATION
# =========================
JWT_SECRET=change-this-to-a-secure-random-string-in-production

# =========================
# PAYFAST (Payment Gateway)
# =========================
# Sandbox (Testing):
PAYFAST_MODE=sandbox
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f1db3175859ac3c
PAYFAST_PASSPHRASE=test-passphrase

# Production (Live):
# PAYFAST_MODE=live
# PAYFAST_MERCHANT_ID=your-merchant-id
# PAYFAST_MERCHANT_KEY=your-merchant-key
# PAYFAST_PASSPHRASE=your-passphrase

# =========================
# EMAIL NOTIFICATIONS
# =========================
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@capsresources.co.za

# =========================
# URLS
# =========================
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# =========================
# SERVER
# =========================
NODE_ENV=development
PORT=5000
```

---

## Video Tutorial Concepts

If creating tutorials, cover:

1. **Installation & Setup** (5 min)
   - Installing Node, MongoDB, Python
   - Project folder structure
   - Running commands

2. **Document Organization** (10 min)
   - Preparing documents
   - Running organization script
   - Understanding the results
   - Verifying accuracy

3. **Database Import** (5 min)
   - Connecting to MongoDB
   - Importing products
   - Verifying in MongoDB shell

4. **Backend Setup** (10 min)
   - Creating .env file
   - Starting server
   - Testing API endpoints

5. **Payment Integration** (15 min)
   - PayFast test credentials
   - Test payment flow
   - Webhook handling
   - Success/failure pages

---

## Additional Help

### Error Messages & Solutions

| Error | Solution |
|-------|----------|
| `MONGODB_URI not defined` | Create `.env` file in server folder |
| `Cannot find module 'express'` | Run `npm install` in server folder |
| `Python not found` | Install Python and add to PATH |
| `PyPDF2 not found` | Run `pip install -r requirements.txt` |
| `Port 5000 already in use` | Kill other process: `netstat -ano \| findstr :5000` |
| `Document content not extractable` | Check if file is PDF, not image-based |

### Getting More Help

- **Backend Issues:** See `server/README.md`
- **Document Issues:** See `scripts/README.md`
- **API Questions:** See `server/README.md` (API Reference section)
- **Payment Issues:** See PayFast docs at payfast.co.za

---

## Production Deployment Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Configure real PayFast merchant credentials
- [ ] Set up MongoDB Atlas for cloud database
- [ ] Configure email with real credentials
- [ ] Enable SSL/HTTPS certificate
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Update `BACKEND_URL` to production domain
- [ ] Set up automated backups
- [ ] Configure CDN for images
- [ ] Set up monitoring and logging
- [ ] Test complete payment flow
- [ ] Load test the system
- [ ] Security audit and penetration testing
- [ ] Set up error tracking (Sentry, etc.)

---

**Status:** ✅ Ready for Use  
**Version:** 2.0  
**Last Updated:** 2024  
**Support:** See README.md files in server/ and scripts/ folders

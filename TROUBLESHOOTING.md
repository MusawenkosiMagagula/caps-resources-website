# CAPS Resources Website - Troubleshooting Guide

Complete guide to resolving common issues during setup and operation.

---

## 🔧 Installation Issues

### Problem: Python Not Found
**Error:** `'python' is not recognized as an internal or external command`

**Solutions:**
1. **Check if Python is installed:**
   ```powershell
   python --version
   ```

2. **Install Python:**
   - Download from: https://www.python.org/downloads/
   - **During installation, check: "Add Python to PATH"**
   - Restart PowerShell after installation

3. **Use explicit path:**
   ```powershell
   C:\Users\YourUsername\AppData\Local\Programs\Python\Python310\python.exe organize_pdfs.py
   ```

4. **Try python3:**
   ```powershell
   python3 --version
   python3 -m pip install -r requirements.txt
   ```

---

### Problem: Node.js Not Found
**Error:** `'npm' is not recognized`

**Solutions:**
1. **Check if Node.js is installed:**
   ```powershell
   node --version
   npm --version
   ```

2. **Install Node.js:**
   - Download from: https://nodejs.org/
   - Choose LTS version
   - Run installer and follow wizard
   - Restart PowerShell

3. **Reinstall if corrupted:**
   ```powershell
   # Uninstall Node.js
   # Download and reinstall fresh
   ```

---

### Problem: npm install Fails
**Error:** `npm ERR! code ERESOLVE` or dependency conflicts

**Solutions:**
1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

2. **Use legacy dependency resolution:**
   ```powershell
   npm install --legacy-peer-deps
   ```

3. **Delete node_modules and package-lock.json:**
   ```powershell
   rm -r node_modules
   rm package-lock.json
   npm install
   ```

4. **Try with newer npm:**
   ```powershell
   npm install -g npm@latest
   npm install
   ```

---

### Problem: pip install Fails
**Error:** `ModuleNotFoundError` or pip not working

**Solutions:**
1. **Use Python module method:**
   ```powershell
   python -m pip install -r requirements.txt
   ```

2. **Update pip first:**
   ```powershell
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

3. **Use pip3:**
   ```powershell
   pip3 install -r requirements.txt
   ```

4. **Install packages individually:**
   ```powershell
   pip install PyPDF2==3.0.1
   pip install python-docx==0.8.11
   pip install openpyxl==3.10.10
   pip install python-pptx==0.6.21
   pip install pymongo==4.6.0
   pip install python-dotenv==1.0.0
   ```

---

## 🗄️ Database Issues

### Problem: MongoDB Won't Start
**Error:** `MongoNetworkError` or `connection refused`

**Solutions:**

**Windows:**
1. **Check if service is running:**
   - Open Services (services.msc)
   - Look for "MongoDB Community Server"
   - If stopped, right-click and start it

2. **Start from command line:**
   ```powershell
   mongod
   ```

3. **Check if port is in use:**
   ```powershell
   netstat -ano | findstr :27017
   ```

4. **Reinstall MongoDB:**
   - Uninstall from Control Panel
   - Download fresh from mongodb.com
   - Run installer

**macOS:**
```bash
brew services start mongodb-community
# or
mongod
```

**Linux:**
```bash
sudo systemctl start mongodb
# or
sudo service mongod start
```

---

### Problem: Cannot Connect to MongoDB
**Error:** `getaddrinfo ENOTFOUND localhost` or connection timeout

**Solutions:**
1. **Verify MongoDB is running:**
   ```powershell
   mongosh
   # Should open MongoDB shell
   exit
   ```

2. **Check if mongosh is installed:**
   ```powershell
   mongosh --version
   ```

3. **Start mongod first:**
   ```powershell
   # In separate PowerShell window:
   mongod
   
   # Then in another window:
   mongosh
   ```

4. **Use correct connection string:**
   ```
   mongodb://localhost:27017/caps-resources
   # NOT mongodb://127.0.0.1:27017 (sometimes doesn't work)
   ```

5. **Check firewall:**
   - Windows Firewall might block MongoDB
   - Add exception for MongoDB (port 27017)

---

### Problem: MongoDB Crashes on Startup
**Error:** `exception in initAndListen: NonExistentPath`

**Solutions:**
1. **Create data directory:**
   ```powershell
   mkdir C:\data\db
   ```

2. **Start with custom path:**
   ```powershell
   mongod --dbpath C:\data\db
   ```

3. **Check disk space:**
   ```powershell
   # Ensure you have at least 1GB free space
   ```

4. **Check permissions:**
   - Right-click PowerShell
   - Run as Administrator

---

## 🔌 Backend Server Issues

### Problem: Server Won't Start
**Error:** `Cannot find module` or `server.js not found`

**Solutions:**
1. **Verify you're in correct folder:**
   ```powershell
   cd C:\caps-resources-website\server
   # Verify server.js exists:
   ls
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Check .env file exists:**
   ```powershell
   # Create if missing:
   copy .env.example .env
   # Then edit with your credentials
   ```

4. **Check Node version:**
   ```powershell
   node --version
   # Should be 14.0 or higher
   ```

---

### Problem: Port 5000 Already in Use
**Error:** `listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. **Find process using port:**
   ```powershell
   netstat -ano | findstr :5000
   ```

2. **Kill process (get PID from above):**
   ```powershell
   taskkill /PID 12345 /F
   ```

3. **Use different port:**
   - Edit `.env`: `PORT=5001`
   - Or change in code

4. **Check if another server is running:**
   ```powershell
   # Make sure no other npm processes running
   Get-Process node
   ```

---

### Problem: Cannot Connect to Server
**Error:** `Failed to fetch from http://localhost:5000`

**Solutions:**
1. **Verify server is running:**
   ```powershell
   curl http://localhost:5000/health
   # Should return: {"status":"ok"}
   ```

2. **Check CORS configuration:**
   - Ensure frontend URL matches CORS settings
   - Frontend URL should be: http://localhost:3000 or http://localhost:8000

3. **Check firewall:**
   - Windows Firewall might block connections
   - Add Node.js as exception

4. **Browser console:**
   - Open Developer Tools (F12)
   - Check Console tab for error messages
   - Check Network tab to see request

---

## 📄 Document Organization Issues

### Problem: No Documents Found
**Error:** `0 documents found` or empty results

**Solutions:**
1. **Check Website folder:**
   ```powershell
   dir C:\caps-resources-website\Website
   # Should show your files
   ```

2. **Verify file extensions:**
   - Supported: .pdf, .docx, .doc, .xlsx, .xls, .pptx, .ppt
   - Check for typos: `.PDF` vs `.pdf`

3. **Check file permissions:**
   - Right-click file → Properties → Security
   - Ensure your user has Read permission

4. **Path in script:**
   ```python
   # In organize_pdfs.py, verify:
   RESOURCES_FOLDER = r"C:\caps-resources-website\Website"
   ```

---

### Problem: Cannot Extract Document Content
**Error:** `Failed to extract text from PDF` or similar

**Solutions:**
1. **Check document is readable:**
   - Try opening file in appropriate application
   - If it opens fine, try different application
   - Scanned PDFs (images) won't work

2. **Verify file is not corrupted:**
   ```powershell
   # Try opening with another tool
   # Try converting to different format
   ```

3. **Check file is not password protected:**
   - If you can't open in reader, script can't read it

4. **For scanned PDFs:**
   - Consider OCR (optical character recognition)
   - Or manually categorize

---

### Problem: Grade/Subject Not Detected
**Error:** `grade: 'unknown'` or `subject: 'unknown'`

**Solutions:**
1. **Ensure document has readable content:**
   - First page should contain grade/subject info
   - Check if text is actually in the document

2. **Check spelling in document:**
   - Script looks for: "Grade 7", "Mathematics", "Grade Seven"
   - If document says "grade7" (no space), might not match

3. **Expand detection patterns:**
   Edit `organize_pdfs.py`:
   ```python
   GRADE_PATTERNS = {
       'grade1': [
           'grade 1', 'grade1', 'gr1', 'grd1',
           'your custom pattern here'
       ],
       # ...
   }
   ```

4. **Manually edit JSON results:**
   - Edit `_organization_results.json`
   - Correct the grade/subject values
   - Run import script

---

### Problem: Duplicate File Names
**Error:** `File already exists` or files getting counter appended

**Solutions:**
1. **This is expected behavior:**
   - Script appends `_1`, `_2`, etc. to duplicates
   - This is correct operation

2. **Prevent duplicates:**
   - Delete duplicate source files before organizing
   - Run organization again

3. **Check JSON for duplicates:**
   - Open `_organization_results.json`
   - Look for same filename repeated
   - Manually verify these are different files

---

## 💾 Database Import Issues

### Problem: Import Fails
**Error:** `MongoError` or `connection failed`

**Solutions:**
1. **Verify MongoDB is running:**
   ```powershell
   mongosh
   # If this fails, start MongoDB first
   exit
   ```

2. **Check .env connection string:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/caps-resources
   ```

3. **Verify organization results exist:**
   ```powershell
   ls C:\caps-resources-website\server\storage\pdfs\_organization_results.json
   ```

4. **Check Python environment:**
   ```powershell
   cd C:\caps-resources-website\scripts
   python import_to_database.py
   ```

---

### Problem: Products Not Showing in Database
**Error:** `Products imported: 0`

**Solutions:**
1. **Check JSON is valid:**
   ```powershell
   # Try opening _organization_results.json in text editor
   # Look for syntax errors (missing quotes, commas, etc.)
   ```

2. **Run organization script first:**
   ```powershell
   python organize_pdfs.py
   # This creates the results JSON
   ```

3. **Verify MongoDB is connected:**
   ```powershell
   mongosh
   > use caps-resources
   > db.products.find()
   exit
   ```

4. **Check import script logic:**
   ```powershell
   # Add debug output to import_to_database.py
   # Print what's being imported
   ```

---

### Problem: Duplicate Prevention Not Working
**Error:** Same product imported multiple times

**Solutions:**
1. **Database already has products:**
   ```powershell
   mongosh
   > use caps-resources
   > db.products.deleteMany({})  # Delete all products
   > exit
   ```

2. **Then re-import:**
   ```powershell
   python import_to_database.py
   ```

3. **Check duplicate detection logic:**
   - Import script checks: `{ pdfFileName: filename }`
   - Ensure filename is unique

---

## 💳 Payment System Issues

### Problem: PayFast Integration Not Working
**Error:** `PayFast signature invalid` or `payment failed`

**Solutions:**
1. **Verify credentials in .env:**
   ```env
   PAYFAST_MERCHANT_ID=10000100
   PAYFAST_MERCHANT_KEY=46f1db3175859ac3c
   PAYFAST_PASSPHRASE=test-passphrase
   ```

2. **Check mode is sandbox:**
   ```env
   PAYFAST_MODE=sandbox
   ```

3. **Test payment details:**
   - Use test card: 4111 1111 1111 1111
   - Use any future expiry
   - Use any 3-digit CVV

4. **Check server logs:**
   - Backend console should show PayFast responses
   - Look for signature verification errors

5. **For production:**
   - Get real merchant credentials from PayFast
   - Test with real cards in sandbox first
   - Switch to live mode when ready

---

### Problem: Payment Webhook Not Firing
**Error:** Order status not updating after payment

**Solutions:**
1. **Ensure backend is running:**
   ```powershell
   # Backend must be accessible from internet
   # ngrok can help for testing: ngrok http 5000
   ```

2. **Configure PayFast webhook URL:**
   - Go to PayFast merchant dashboard
   - Add webhook URL: `https://yourdomain.com/api/orders/webhook`
   - Or use ngrok during testing

3. **Check webhook handler:**
   - Verify POST `/api/orders/webhook` exists
   - Check signature verification logic
   - Add logging to see what's received

4. **Test webhook locally:**
   ```powershell
   # Use Postman or curl to test
   # This won't work with localhost from internet
   # Use ngrok to expose localhost
   ```

---

## 🌐 Frontend Issues

### Problem: Modal Not Appearing
**Error:** Subject selection modal doesn't show

**Solutions:**
1. **Check browser console:**
   - Open DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

2. **Verify script.js is loaded:**
   ```html
   <!-- In index.html, check: -->
   <script src="script.js"></script>
   <!-- Is at bottom of file -->
   ```

3. **Check CSS is working:**
   - Make sure styles.css is linked
   - Inspect modal element with DevTools
   - See if styles are applied

4. **Verify JavaScript syntax:**
   - Check for typos in script.js
   - No console errors about undefined variables

---

### Problem: Styles Not Showing
**Error:** Website looks broken or unstyled

**Solutions:**
1. **Verify CSS file exists:**
   ```powershell
   ls C:\caps-resources-website\styles.css
   ```

2. **Check link in HTML:**
   ```html
   <!-- In index.html -->
   <link rel="stylesheet" href="styles.css">
   ```

3. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Reload page

4. **Check for CSS errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for CSS load errors

---

### Problem: Images Not Loading
**Error:** Hero background image not showing

**Solutions:**
1. **Verify image files exist:**
   ```powershell
   ls C:\caps-resources-website\images\
   ```

2. **Check image path in CSS:**
   ```css
   /* In styles.css, check: */
   background-image: url('images/elnaz-asadi-E3HfEm8QcNc-unsplash.jpg');
   ```

3. **Try with full path:**
   ```css
   background-image: url('./images/elnaz-asadi-E3HfEm8QcNc-unsplash.jpg');
   ```

4. **Check image format:**
   - Make sure it's .jpg, .png, .gif, or .webp
   - Not .JPEG or other variations

5. **Check file permissions:**
   - Right-click image → Properties
   - Ensure your user has Read permission

---

## 📊 Verification Checklist

Use this to verify everything is working:

### ✅ Installation Verified
- [ ] `node --version` works
- [ ] `npm --version` works
- [ ] `python --version` works
- [ ] `mongosh` connects to MongoDB

### ✅ Backend Verified
- [ ] `npm install` in server folder completed
- [ ] `.env` file created with values
- [ ] `npm run dev` starts without errors
- [ ] `curl http://localhost:5000/health` returns ok

### ✅ Database Verified
- [ ] MongoDB is running (`mongosh` works)
- [ ] Can see collections with `show collections`
- [ ] Products collection exists and has data

### ✅ Documents Verified
- [ ] Files in `Website/` folder
- [ ] `python organize_pdfs.py` completes successfully
- [ ] `_organization_results.json` has entries
- [ ] Files organized in `server/storage/pdfs/`

### ✅ Frontend Verified
- [ ] `index.html` opens in browser
- [ ] No console errors (F12)
- [ ] Subject modal appears when clicking grade
- [ ] Styles look correct

---

## 🆘 Still Having Issues?

### Debug Steps
1. **Check console output:**
   - Server: `npm run dev` shows all logs
   - Browser: F12 → Console tab
   - Python: Run script directly, see output

2. **Test API endpoints:**
   ```powershell
   # Test backend is running
   curl http://localhost:5000/health
   
   # Test get products
   curl http://localhost:5000/api/products
   ```

3. **Check file permissions:**
   - Ensure can read/write in folders
   - Run PowerShell as Administrator if needed

4. **Restart everything:**
   - Stop backend: Ctrl+C
   - Stop MongoDB
   - Restart in order:
     1. MongoDB
     2. Backend server
     3. Refresh browser

5. **Check logs:**
   - Backend logs show in console
   - MongoDB logs in data folder
   - Browser console (F12)

### Get Help
- Review error messages carefully
- Search error message online
- Check documentation:
  - COMPLETE_SETUP.md
  - server/README.md
  - scripts/README.md
- Look at code comments for hints

---

**Last Updated:** 2024  
**Version:** 2.0

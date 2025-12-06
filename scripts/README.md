# PDF Organization and Import Scripts

Automated scripts to organize, categorize, and import educational PDF resources into the CAPS Resources database.

## Features

✅ **Automatic PDF Analysis** - Reads first page to extract metadata
✅ **Smart Categorization** - Identifies grade, subject, type, and year
✅ **Consistent Naming** - `grade-subject-type-year.pdf` format
✅ **Organized Structure** - Creates folder hierarchy by grade/subject
✅ **Database Import** - Automatically imports to MongoDB
✅ **Duplicate Detection** - Prevents duplicate imports

## Prerequisites

### 1. Install Python Dependencies

```bash
cd scripts
pip install -r requirements.txt
```

### 2. Install Tesseract OCR (Optional - for better text extraction)

**Windows:**
```bash
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Install and add to PATH
```

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

## Usage

### Step 1: Organize PDFs

Place all your PDF resources in the `resources` folder, then run:

```bash
python organize_pdfs.py
```

This will:
- Scan all PDFs in the resources folder
- Read the first page of each PDF
- Extract grade, subject, type, and year
- Rename and organize into structured folders
- Generate a JSON report

**Example Output Structure:**
```
server/storage/pdfs/
├── grade1/
│   ├── Mathematics/
│   │   ├── grade1-mathematics-worksheets-2024.pdf
│   │   └── grade1-mathematics-assessments-2024.pdf
│   └── English/
│       └── grade1-english-worksheets-2024.pdf
├── grade2/
│   └── Life-Skills/
└── _organization_results.json
```

### Step 2: Import to Database

After organizing, import to MongoDB:

```bash
python import_to_database.py
```

This will:
- Read the organization results
- Create product entries in MongoDB
- Set appropriate prices by grade level
- Generate titles and descriptions
- Skip duplicates

## Naming Convention

PDFs are renamed using this pattern:
```
{grade}-{subject}-{type}-{year}.pdf
```

Examples:
- `grade1-mathematics-worksheets-2024.pdf`
- `grade7-physical-sciences-assessments-2024.pdf`
- `grade12-english-study-guides-2024.pdf`

## Supported Categories

### Grades
- Preschool, Reception
- Grade 1-12

### Subjects
- Mathematics, English, Afrikaans
- Life Skills, Natural Sciences, Social Sciences
- Physical Sciences, Life Sciences
- Accounting, Business Studies, Economics
- Technology, Creative Arts
- Mathematical Literacy

### Resource Types
- Worksheets
- Assessments
- Lesson Plans
- Activities
- Study Guides

## Configuration

Edit the script constants if needed:

```python
# In organize_pdfs.py
RESOURCES_FOLDER = r"C:\caps-resources-website\resources"
ORGANIZED_FOLDER = r"C:\caps-resources-website\server\storage\pdfs"

# In import_to_database.py
PRICE_MAP = {
    'grade1': 39.99,
    'grade10': 79.99,
    # ... customize prices
}
```

## Pricing Structure

Default prices by grade:
- Preschool/Reception: R29.99 - R34.99
- Grade 1-3: R39.99
- Grade 4-6: R49.99
- Grade 7-9: R59.99
- Grade 10-12: R79.99 - R89.99

## Troubleshooting

### PDF Text Extraction Issues

If PDFs are image-based (scanned documents):
1. Install Tesseract OCR
2. The script will use OCR to extract text
3. May take longer but improves accuracy

### Grade/Subject Not Detected

The script looks for common patterns in the text. If not detected:
1. Check if the first page contains clear grade/subject info
2. Add custom patterns to the script
3. Manually organize problematic files

### Database Connection Issues

Ensure MongoDB is running and .env is configured:
```bash
# Check MongoDB status
mongod --version

# Start MongoDB if needed
mongod
```

## Advanced Usage

### Custom Pattern Matching

Add your own patterns to improve detection:

```python
# In organize_pdfs.py
SUBJECT_PATTERNS = {
    'Your Subject': ['pattern1', 'pattern2', 'pattern3'],
    # ...
}
```

### Batch Processing

Process specific folders:

```python
# Modify organize_pdfs.py
RESOURCES_FOLDER = r"C:\specific-folder\2024-resources"
```

### Re-import with Different Prices

```python
# In import_to_database.py
PRICE_MAP = {
    'grade1': 29.99,  # Update prices
    # ...
}

# Delete existing products first
products_collection.delete_many({})

# Then re-import
python import_to_database.py
```

## Output Files

### _organization_results.json
Contains full details of all organized PDFs:
```json
[
  {
    "original_path": "...",
    "new_path": "...",
    "new_filename": "grade1-mathematics-worksheets-2024.pdf",
    "grade": "grade1",
    "subject": "Mathematics",
    "type": "worksheets",
    "year": "2024",
    "pages": 25,
    "file_size": "2.3 MB"
  }
]
```

Use this for:
- Verifying organization accuracy
- Bulk database operations
- Analytics and reporting

## Tips

1. **Organize first, check results, then import** - Review `_organization_results.json` before importing
2. **Keep originals** - The script copies files, originals remain in resources folder
3. **Test with small batch** - Try with a few PDFs first
4. **Check first page quality** - Ensure PDFs have readable text on first page
5. **Manual overrides** - For tricky PDFs, rename manually before organizing

## Support

For issues or questions:
- Check the console output for detailed error messages
- Review the JSON results file
- Ensure PDFs are not corrupted or password-protected

## Next Steps

After importing:
1. Start the backend server: `cd server && npm run dev`
2. Verify products in database: `mongosh` → `db.products.find()`
3. Update frontend to fetch from API
4. Test payment flow with organized PDFs

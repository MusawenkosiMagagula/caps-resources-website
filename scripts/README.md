# Document Organization and Import Scripts

Automated scripts to organize, categorize, and import educational documents (PDF, Word, Excel, PowerPoint) into the CAPS Resources database.

## Features

✅ **Multi-Format Support** - PDF, Word, Excel, PowerPoint
✅ **Smart Content Analysis** - Reads document content, not just filenames
✅ **Random Name Handling** - Intelligently extracts actual subject from content
✅ **Automatic Categorization** - Identifies grade, subject, type, and year
✅ **Consistent Naming** - `grade-subject-type-year.extension` format
✅ **Organized Structure** - Creates folder hierarchy by grade/subject
✅ **Database Import** - Automatically imports to MongoDB
✅ **Duplicate Detection** - Prevents duplicate imports

## Prerequisites

### 1. Install Python Dependencies

```bash
cd scripts
pip install -r requirements.txt
```

## Usage

### Step 1: Organize Documents

Place all your documents in the `Website` folder, then run:

```bash
python organize_pdfs.py
```

This will:
- Scan all documents in the Website folder
- Read the content of each document (not just filename)
- Extract grade, subject, type, and year from content
- Rename into structured format
- Organize into folder hierarchy
- Generate a JSON report

**Supported Formats:**
- PDF (.pdf)
- Word (.docx, .doc)
- Excel (.xlsx, .xls)
- PowerPoint (.pptx, .ppt)

**Example Output Structure:**
```
server/storage/pdfs/
├── grade1/
│   ├── Mathematics/
│   │   ├── grade1-mathematics-worksheets-2024.pdf
│   │   └── grade1-mathematics-assessments-2024.docx
│   └── English/
│       └── grade1-english-worksheets-2024.xlsx
├── grade7/
│   └── Mathematics/
│       └── grade7-mathematics-lesson-plans-2024.pptx
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
- Track file types in database
- Skip duplicates

## Naming Convention

Documents are renamed using this pattern:
```
{grade}-{subject}-{type}-{year}.{extension}
```

Examples:
- `grade1-mathematics-worksheets-2024.pdf`
- `grade7-physical-sciences-assessments-2024.docx`
- `grade12-english-study-guides-2024.xlsx`
- `grade4-life-skills-lesson-plans-2024.pptx`

## Smart Content Detection

### How It Works

1. **Ignores Filenames** - Doesn't rely on the original filename
2. **Reads Content** - Opens and reads the actual document content
3. **Scores Matches** - Searches for keywords in the content
4. **Picks Best Match** - Selects the most likely subject based on frequency

### Example

```
Original File: "asdfgh_2024.pdf"
First Page Content: "Grade 7 Mathematics... worksheets... problem solving..."

Script Result:
- Grade: grade7 (found "grade 7")
- Subject: Mathematics (most frequent keyword)
- Type: worksheets (found "worksheets")
- Year: 2024 (extracted from filename/content)
- New Name: grade7-mathematics-worksheets-2024.pdf
```

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
- First Additional Language, Home Language

### Resource Types
- Worksheets
- Assessments
- Lesson Plans
- Activities
- Study Guides

### File Types
- PDF
- Word (DOCX, DOC)
- Excel (XLSX, XLS)
- PowerPoint (PPTX, PPT)

## Configuration

Edit the script constants if needed:

```python
# In organize_pdfs.py
RESOURCES_FOLDER = r"C:\caps-resources-website\Website"
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

### Document Text Extraction Issues

If documents are image-based or scanned:
1. Ensure documents are readable PDFs/files
2. Check file is not password protected
3. Try opening manually to verify content is readable

### Grade/Subject Not Detected

The script looks for keywords in the content. If not detected:
1. Check if the document contains clear grade/subject info
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

TYPE_PATTERNS = {
    'custom-type': ['pattern1', 'pattern2'],
    # ...
}
```

### Batch Processing

Process specific folders:

```python
# Modify organize_pdfs.py
RESOURCES_FOLDER = r"C:\specific-folder\documents"
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
Contains full details of all organized documents:
```json
[
  {
    "original_path": "...",
    "new_path": "...",
    "new_filename": "grade1-mathematics-worksheets-2024.pdf",
    "file_type": "pdf",
    "grade": "grade1",
    "subject": "Mathematics",
    "type": "worksheets",
    "year": "2024",
    "pages": 25,
    "file_size": "2.3 MB",
    "extension": ".pdf"
  }
]
```

Use this for:
- Verifying organization accuracy
- Bulk database operations
- Analytics and reporting
- Manual corrections

## Tips

1. **Organize first, check results, then import** - Review `_organization_results.json` before importing
2. **Keep originals** - The script copies files, originals remain in Website folder
3. **Test with small batch** - Try with a few documents first
4. **Check content quality** - Ensure documents have readable content
5. **Review misclassifications** - Edit JSON if needed before importing
6. **Use for all file types** - Works equally well with PDF, Word, Excel, PowerPoint

## Support

For issues or questions:
- Check the console output for detailed error messages
- Review the JSON results file
- Ensure documents are readable (not corrupted/password-protected)
- Check that MongoDB is running if importing

## Next Steps

After importing:
1. Start the backend server: `cd server && npm run dev`
2. Verify products in database: `mongosh` → `db.products.find()`
3. Update frontend to fetch from API
4. Test download functionality with various file types
5. Monitor file type distribution in analytics

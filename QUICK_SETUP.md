# Quick Setup Guide for Document Organization

## Step-by-Step Instructions

### 1. Install Python Dependencies

Open PowerShell in the scripts folder:

```powershell
cd C:\caps-resources-website\scripts
pip install -r requirements.txt
```

### 2. Place Your Documents

Put all your documents in the `Website` folder:
```
C:\caps-resources-website\Website\
```

Supported file types:
- ✅ PDF (.pdf)
- ✅ Word Documents (.docx, .doc)
- ✅ Excel Spreadsheets (.xlsx, .xls)
- ✅ PowerPoint (.pptx, .ppt)

You can put them in any subfolder structure - the script will find them all.

### 3. Run the Organization Script

**Option A: Use the Batch File (Easiest)**
```powershell
.\run_organization.bat
```

**Option B: Run Python Directly**
```powershell
python organize_pdfs.py
```

### 4. Review the Results

Check the organized files in:
```
C:\caps-resources-website\server\storage\pdfs\
```

And review the JSON report:
```
C:\caps-resources-website\server\storage\pdfs\_organization_results.json
```

### 5. Import to Database (Optional)

If you want to import to MongoDB:

```powershell
python import_to_database.py
```

## What the Script Does

1. **Scans** all documents in the Website folder
2. **Reads** the content of each document
3. **Extracts** metadata (grade, subject, type, year)
4. **Renames** to: `grade-subject-type-year.extension`
5. **Organizes** into folders: `grade/subject/`
6. **Generates** a JSON report with all details

## Smart Content Detection

The script is intelligent:
- **Doesn't rely on filenames** - reads the actual content
- **Ignores random names/symbols** - focuses on document content
- **Finds grade & subject** from the text inside
- **Detects document type** (worksheet, test, lesson plan, etc.)
- **Extracts year** from content
- **Scores matches** to find most relevant subject

## Example

**Before:**
```
Website/
├── asdfgh_2024.pdf (contains Grade 7 Mathematics content)
├── document1.docx (English Grade 1 lesson plan)
└── file_343_data.xlsx (Grade 5 Science assessment)
```

**After:**
```
server/storage/pdfs/
├── grade7/
│   └── Mathematics/
│       └── grade7-mathematics-worksheets-2024.pdf
├── grade1/
│   └── English/
│       └── grade1-english-lesson-plans-2024.docx
└── grade5/
    └── Natural-Sciences/
        └── grade5-natural-sciences-assessments-2024.xlsx
```

## Supported Categories

### Grades
- Preschool, Reception, Grade 1-12

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

### File Types
- PDF
- Word (DOCX, DOC)
- Excel (XLSX, XLS)
- PowerPoint (PPTX, PPT)

## Troubleshooting

### "pip is not recognized"
Install Python from https://www.python.org/ and check "Add to PATH"

### "No documents found"
Make sure documents are in `C:\caps-resources-website\Website\`

### "Could not determine grade"
The document doesn't have clear grade information in its content. Check if it's readable.

### "MongoDB connection error"
Make sure MongoDB is installed and running, or use MongoDB Atlas cloud.

## Tips

- **Test First**: Try with 5-10 documents before processing all
- **Check Quality**: Ensure documents are readable (not corrupted)
- **Review JSON**: Check `_organization_results.json` for accuracy
- **Keep Originals**: The script copies files, your originals are safe
- **Content Matters**: The better the document content, the better the categorization

## Need Help?

See the full documentation in `scripts/README.md`

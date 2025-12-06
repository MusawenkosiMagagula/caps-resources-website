# Quick Setup Guide for PDF Organization

## Step-by-Step Instructions

### 1. Install Python Dependencies

Open PowerShell in the scripts folder:

```powershell
cd C:\caps-resources-website\scripts
pip install -r requirements.txt
```

### 2. Place Your PDFs

Put all your PDF resources in the `resources` folder:
```
C:\caps-resources-website\resources\
```

You can put them in any subfolders - the script will find them all.

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

1. **Scans** all PDFs in the resources folder
2. **Reads** the first page of each PDF
3. **Extracts** metadata (grade, subject, type, year)
4. **Renames** PDFs to: `grade-subject-type-year.pdf`
5. **Organizes** into folders: `grade/subject/`
6. **Generates** a JSON report with all details

## Example

**Before:**
```
resources/
├── math worksheet gr 1.pdf
├── Grade 2 English Test 2024.pdf
└── science_notes_grade_7.pdf
```

**After:**
```
server/storage/pdfs/
├── grade1/
│   └── Mathematics/
│       └── grade1-mathematics-worksheets-2024.pdf
├── grade2/
│   └── English/
│       └── grade2-english-assessments-2024.pdf
└── grade7/
    └── Natural-Sciences/
        └── grade7-natural-sciences-study-guides-2024.pdf
```

## Troubleshooting

### "pip is not recognized"
Install Python from https://www.python.org/ and check "Add to PATH"

### "No PDFs found"
Make sure PDFs are in `C:\caps-resources-website\resources\`

### "Could not determine grade"
The first page doesn't have clear grade information. Add manually or improve patterns in the script.

### "MongoDB connection error"
Make sure MongoDB is installed and running, or use MongoDB Atlas cloud.

## Tips

- **Test First**: Try with 5-10 PDFs before processing all
- **Check Quality**: Ensure PDFs have readable text (not just images)
- **Review JSON**: Check `_organization_results.json` for accuracy
- **Keep Originals**: The script copies files, your originals are safe

## Need Help?

See the full documentation in `scripts/README.md`

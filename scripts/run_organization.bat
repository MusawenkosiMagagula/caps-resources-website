@echo off
echo ========================================
echo CAPS Resources PDF Organization Tool
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo Checking dependencies...
pip show PyPDF2 >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)

echo.
echo ========================================
echo Step 1: Organizing PDFs
echo ========================================
echo.
python organize_pdfs.py

if errorlevel 1 (
    echo.
    echo ERROR: PDF organization failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Organization Complete!
echo ========================================
echo.
echo Do you want to import to database? (Y/N)
set /p IMPORT="Choice: "

if /i "%IMPORT%"=="Y" (
    echo.
    echo ========================================
    echo Step 2: Importing to Database
    echo ========================================
    echo.
    python import_to_database.py
    
    if errorlevel 1 (
        echo.
        echo ERROR: Database import failed!
        echo Make sure MongoDB is running!
        pause
        exit /b 1
    )
    
    echo.
    echo ========================================
    echo SUCCESS! All resources organized and imported.
    echo ========================================
) else (
    echo.
    echo Skipping database import.
    echo You can import later by running: python import_to_database.py
)

echo.
pause

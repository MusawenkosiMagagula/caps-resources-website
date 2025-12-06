import os
import shutil
import re
from pathlib import Path
from PyPDF2 import PdfReader
from PIL import Image
import pytesseract

# Configuration
RESOURCES_FOLDER = r"C:\caps-resources-website\resources"
ORGANIZED_FOLDER = r"C:\caps-resources-website\server\storage\pdfs"
THUMBNAILS_FOLDER = r"C:\caps-resources-website\images\products"

# Grade mappings
GRADE_PATTERNS = {
    'preschool': ['preschool', 'pre-school', 'pre school', 'playgroup', 'creche'],
    'reception': ['reception', 'grade r', 'grade 0'],
    'grade1': ['grade 1', 'grade one', 'gr 1', 'gr1'],
    'grade2': ['grade 2', 'grade two', 'gr 2', 'gr2'],
    'grade3': ['grade 3', 'grade three', 'gr 3', 'gr3'],
    'grade4': ['grade 4', 'grade four', 'gr 4', 'gr4'],
    'grade5': ['grade 5', 'grade five', 'gr 5', 'gr5'],
    'grade6': ['grade 6', 'grade six', 'gr 6', 'gr6'],
    'grade7': ['grade 7', 'grade seven', 'gr 7', 'gr7'],
    'grade8': ['grade 8', 'grade eight', 'gr 8', 'gr8'],
    'grade9': ['grade 9', 'grade nine', 'gr 9', 'gr9'],
    'grade10': ['grade 10', 'grade ten', 'gr 10', 'gr10'],
    'grade11': ['grade 11', 'grade eleven', 'gr 11', 'gr11'],
    'grade12': ['grade 12', 'grade twelve', 'gr 12', 'gr12', 'matric']
}

# Subject mappings
SUBJECT_PATTERNS = {
    'Mathematics': ['mathematics', 'math', 'maths', 'wiskunde'],
    'English': ['english', 'engels', 'home language english', 'hl english'],
    'Afrikaans': ['afrikaans', 'afr', 'home language afrikaans'],
    'Life Skills': ['life skills', 'lewensvaardighede'],
    'Natural Sciences': ['natural sciences', 'science', 'natuurwetenskappe'],
    'Social Sciences': ['social sciences', 'history', 'geography', 'sosiale wetenskappe'],
    'Physical Sciences': ['physical sciences', 'fisiese wetenskappe'],
    'Life Sciences': ['life sciences', 'biology', 'lewenswetenskappe'],
    'Accounting': ['accounting', 'rekeningkunde'],
    'Business Studies': ['business studies', 'besigheidstudies'],
    'Economics': ['economics', 'ekonomie'],
    'Technology': ['technology', 'tegnologie'],
    'Creative Arts': ['creative arts', 'arts', 'kreatiewe kunste'],
    'Mathematical Literacy': ['mathematical literacy', 'math lit', 'maths literacy', 'wiskundige geletterdheid']
}

# Type mappings
TYPE_PATTERNS = {
    'worksheets': ['worksheet', 'work sheet', 'activity sheet', 'werksblad'],
    'assessments': ['assessment', 'test', 'exam', 'examination', 'toets', 'eksamen'],
    'lesson-plans': ['lesson plan', 'teaching plan', 'lesplan'],
    'activities': ['activity', 'activities', 'aktiwiteit', 'aktiwiteite'],
    'study-guides': ['study guide', 'revision', 'notes', 'studiegids', 'hersiening']
}

def extract_text_from_pdf(pdf_path, max_pages=2):
    """Extract text from first few pages of PDF"""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for i in range(min(max_pages, len(reader.pages))):
            text += reader.pages[i].extract_text() + "\n"
        return text.lower()
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return ""

def extract_grade(text):
    """Extract grade from text"""
    for grade, patterns in GRADE_PATTERNS.items():
        for pattern in patterns:
            if pattern.lower() in text:
                return grade
    return None

def extract_subject(text):
    """Extract subject from text"""
    for subject, patterns in SUBJECT_PATTERNS.items():
        for pattern in patterns:
            if pattern.lower() in text:
                return subject
    return "General"

def extract_type(text, filename):
    """Extract resource type from text and filename"""
    combined_text = text + " " + filename.lower()
    for resource_type, patterns in TYPE_PATTERNS.items():
        for pattern in patterns:
            if pattern.lower() in combined_text:
                return resource_type
    return "worksheets"

def extract_year(text):
    """Extract year from text"""
    year_pattern = r'\b(20\d{2})\b'
    matches = re.findall(year_pattern, text)
    if matches:
        return matches[0]
    return "2024"

def clean_text_for_filename(text):
    """Clean text to be filename-safe"""
    # Remove special characters
    text = re.sub(r'[^\w\s-]', '', text)
    # Replace spaces with hyphens
    text = re.sub(r'\s+', '-', text)
    # Remove multiple hyphens
    text = re.sub(r'-+', '-', text)
    return text.strip('-').lower()

def get_pdf_page_count(pdf_path):
    """Get number of pages in PDF"""
    try:
        reader = PdfReader(pdf_path)
        return len(reader.pages)
    except:
        return 0

def get_file_size_readable(file_path):
    """Get file size in readable format"""
    size_bytes = os.path.getsize(file_path)
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def process_pdf(pdf_path, output_base_dir):
    """Process a single PDF file"""
    try:
        print(f"\nProcessing: {os.path.basename(pdf_path)}")
        
        # Extract text from first pages
        text = extract_text_from_pdf(pdf_path)
        original_filename = os.path.basename(pdf_path)
        
        # Extract metadata
        grade = extract_grade(text)
        subject = extract_subject(text)
        resource_type = extract_type(text, original_filename)
        year = extract_year(text)
        
        if not grade:
            print(f"  ⚠️  Could not determine grade, skipping...")
            return None
        
        # Get file info
        pages = get_pdf_page_count(pdf_path)
        file_size = get_file_size_readable(pdf_path)
        
        # Create new filename: grade-subject-type-year.pdf
        new_filename = f"{grade}-{clean_text_for_filename(subject)}-{resource_type}-{year}.pdf"
        
        # Create output directory structure
        output_dir = os.path.join(output_base_dir, grade, subject.replace(' ', '-'))
        os.makedirs(output_dir, exist_ok=True)
        
        # Full output path
        output_path = os.path.join(output_dir, new_filename)
        
        # Handle duplicate filenames
        counter = 1
        base_name = new_filename[:-4]
        while os.path.exists(output_path):
            new_filename = f"{base_name}-{counter}.pdf"
            output_path = os.path.join(output_dir, new_filename)
            counter += 1
        
        # Copy file
        shutil.copy2(pdf_path, output_path)
        
        print(f"  ✅ Organized as: {new_filename}")
        print(f"  📁 Location: {output_dir}")
        print(f"  📊 Grade: {grade} | Subject: {subject} | Type: {resource_type}")
        print(f"  📄 Pages: {pages} | Size: {file_size}")
        
        return {
            'original_path': pdf_path,
            'new_path': output_path,
            'new_filename': new_filename,
            'grade': grade,
            'subject': subject,
            'type': resource_type,
            'year': year,
            'pages': pages,
            'file_size': file_size,
            'text_preview': text[:200]
        }
        
    except Exception as e:
        print(f"  ❌ Error processing {pdf_path}: {e}")
        return None

def scan_and_organize():
    """Main function to scan and organize all PDFs"""
    print("=" * 80)
    print("CAPS RESOURCES PDF ORGANIZER")
    print("=" * 80)
    
    # Create output directories
    os.makedirs(ORGANIZED_FOLDER, exist_ok=True)
    os.makedirs(THUMBNAILS_FOLDER, exist_ok=True)
    
    # Find all PDF files
    pdf_files = []
    if os.path.exists(RESOURCES_FOLDER):
        for root, dirs, files in os.walk(RESOURCES_FOLDER):
            for file in files:
                if file.lower().endswith('.pdf'):
                    pdf_files.append(os.path.join(root, file))
    else:
        print(f"❌ Resources folder not found: {RESOURCES_FOLDER}")
        return
    
    print(f"\n📂 Found {len(pdf_files)} PDF files")
    print(f"📤 Output directory: {ORGANIZED_FOLDER}\n")
    
    # Process each PDF
    results = []
    successful = 0
    failed = 0
    
    for pdf_path in pdf_files:
        result = process_pdf(pdf_path, ORGANIZED_FOLDER)
        if result:
            results.append(result)
            successful += 1
        else:
            failed += 1
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully organized: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Total processed: {len(pdf_files)}")
    
    # Generate summary by grade and subject
    print("\n📚 Resources by Grade:")
    by_grade = {}
    for result in results:
        grade = result['grade']
        if grade not in by_grade:
            by_grade[grade] = []
        by_grade[grade].append(result)
    
    for grade in sorted(by_grade.keys()):
        print(f"\n  {grade.upper()}: {len(by_grade[grade])} resources")
        subjects = {}
        for item in by_grade[grade]:
            subject = item['subject']
            subjects[subject] = subjects.get(subject, 0) + 1
        for subject, count in sorted(subjects.items()):
            print(f"    - {subject}: {count}")
    
    # Save results to JSON for database import
    import json
    results_file = os.path.join(ORGANIZED_FOLDER, '_organization_results.json')
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Results saved to: {results_file}")
    print("\n✨ Organization complete!")

if __name__ == "__main__":
    scan_and_organize()

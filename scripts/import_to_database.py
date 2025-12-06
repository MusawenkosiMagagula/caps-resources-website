import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv('../server/.env')

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/caps-resources')
client = MongoClient(MONGODB_URI)
db = client['caps-resources']
products_collection = db['products']

# Default prices by grade level
PRICE_MAP = {
    'preschool': 29.99,
    'reception': 34.99,
    'grade1': 39.99,
    'grade2': 39.99,
    'grade3': 39.99,
    'grade4': 49.99,
    'grade5': 49.99,
    'grade6': 49.99,
    'grade7': 59.99,
    'grade8': 59.99,
    'grade9': 59.99,
    'grade10': 79.99,
    'grade11': 79.99,
    'grade12': 89.99
}

def generate_title(grade, subject, resource_type, year):
    """Generate a proper title for the product"""
    grade_display = grade.replace('grade', 'Grade ').title()
    if grade == 'preschool':
        grade_display = 'Preschool'
    elif grade == 'reception':
        grade_display = 'Reception'
    
    type_display = resource_type.replace('-', ' ').title()
    
    return f"{grade_display} {subject} {type_display} ({year})"

def generate_description(result):
    """Generate description from PDF content"""
    text_preview = result.get('text_preview', '')
    
    description = f"Comprehensive {result['type'].replace('-', ' ')} for {result['grade'].replace('grade', 'Grade ')} {result['subject']}. "
    description += f"This {result['pages']}-page resource provides quality educational content aligned with CAPS curriculum requirements. "
    description += f"Perfect for educators and parents supporting learners in {result['subject']}."
    
    return description

def import_to_database():
    """Import organized PDFs into MongoDB"""
    print("=" * 80)
    print("IMPORTING RESOURCES TO DATABASE")
    print("=" * 80)
    
    # Load results
    results_file = r'C:\caps-resources-website\server\storage\pdfs\_organization_results.json'
    
    if not os.path.exists(results_file):
        print(f"❌ Results file not found: {results_file}")
        print("Please run organize_pdfs.py first!")
        return
    
    with open(results_file, 'r', encoding='utf-8') as f:
        results = json.load(f)
    
    print(f"📊 Found {len(results)} resources to import\n")
    
    imported = 0
    skipped = 0
    errors = 0
    
    for result in results:
        try:
            # Check if already exists
            existing = products_collection.find_one({
                'pdfFileName': result['new_filename']
            })
            
            if existing:
                print(f"⏭️  Skipping {result['new_filename']} (already exists)")
                skipped += 1
                continue
            
            # Create product document
            product = {
                'title': generate_title(
                    result['grade'],
                    result['subject'],
                    result['type'],
                    result['year']
                ),
                'description': generate_description(result),
                'grade': result['grade'],
                'subject': result['subject'],
                'price': PRICE_MAP.get(result['grade'], 49.99),
                'pdfFileName': result['new_filename'],
                'fileSize': result['file_size'],
                'pages': result['pages'],
                'thumbnail': f"/images/products/{result['grade']}-{result['subject'].lower().replace(' ', '-')}.jpg",
                'category': result['type'],
                'tags': [
                    result['grade'],
                    result['subject'],
                    result['type'],
                    result['year'],
                    'CAPS',
                    'South Africa'
                ],
                'downloads': 0,
                'isActive': True,
                'createdAt': datetime.now()
            }
            
            # Insert into database
            products_collection.insert_one(product)
            print(f"✅ Imported: {product['title']}")
            imported += 1
            
        except Exception as e:
            print(f"❌ Error importing {result.get('new_filename', 'unknown')}: {e}")
            errors += 1
    
    # Summary
    print("\n" + "=" * 80)
    print("IMPORT SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully imported: {imported}")
    print(f"⏭️  Skipped (duplicates): {skipped}")
    print(f"❌ Errors: {errors}")
    print(f"📊 Total in database: {products_collection.count_documents({})}")
    
    # Show breakdown by grade
    print("\n📚 Database Breakdown:")
    pipeline = [
        {'$group': {
            '_id': '$grade',
            'count': {'$sum': 1}
        }},
        {'$sort': {'_id': 1}}
    ]
    
    for item in products_collection.aggregate(pipeline):
        print(f"  {item['_id']}: {item['count']} resources")
    
    print("\n✨ Import complete!")

if __name__ == "__main__":
    import_to_database()

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['preschool', 'reception', 'grade1', 'grade2', 'grade3', 'grade4', 
           'grade5', 'grade6', 'grade7', 'grade8', 'grade9', 'grade10', 
           'grade11', 'grade12']
  },
  subject: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pdfFileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: String
  },
  pages: {
    type: Number
  },
  thumbnail: {
    type: String
  },
  category: {
    type: String,
    enum: ['worksheets', 'assessments', 'lesson-plans', 'activities', 'study-guides']
  },
  tags: [String],
  downloads: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ grade: 1, subject: 1 });
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

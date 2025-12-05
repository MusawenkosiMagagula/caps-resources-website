const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class PDFService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    this.pdfStoragePath = process.env.PDF_STORAGE_PATH || './storage/pdfs';
  }

  // Generate secure download links with expiry
  async generateDownloadLinks(order) {
    const downloadLinks = [];
    const expiryHours = 72; // 3 days

    for (const item of order.items) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);

      downloadLinks.push({
        product: item.product._id,
        token,
        expiresAt,
        downloads: 0
      });
    }

    return downloadLinks;
  }

  // Send purchase email with download links
  async sendPurchaseEmail(order) {
    try {
      const user = await order.populate('user');
      const products = order.items.map(item => item.product);

      // Create download links HTML
      const downloadLinksHTML = order.downloadLinks.map((link, index) => {
        const product = products[index];
        const downloadUrl = `${process.env.FRONTEND_URL}/download/${link.token}`;
        
        return `
          <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${product.title}</h3>
            <p style="margin: 0 0 10px 0; color: #666;">${product.grade} - ${product.subject}</p>
            <a href="${downloadUrl}" 
               style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Download PDF
            </a>
          </div>
        `;
      }).join('');

      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Your CAPS Resources Purchase</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You for Your Purchase!</h1>
          </div>
          
          <div style="padding: 30px; background: #fff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Dear ${user.name},</p>
            
            <p>Thank you for purchasing educational resources from CAPS Resources! Your order has been confirmed and your PDFs are ready to download.</p>
            
            <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Your Resources:</h2>
            
            ${downloadLinksHTML}
            
            <div style="margin: 30px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <p style="margin: 0; font-weight: bold;">⚠️ Important:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Your download links are valid for 72 hours</li>
                <li>Each PDF can be downloaded up to 5 times</li>
                <li>Save your PDFs to your device immediately</li>
              </ul>
            </div>
            
            <h3>Order Details:</h3>
            <p>
              <strong>Order ID:</strong> ${order._id}<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
              <strong>Total:</strong> R${order.totalAmount.toFixed(2)}
            </p>
            
            <p>If you have any questions or need assistance, please contact us at support@capsresources.co.za</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The CAPS Resources Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} CAPS Resources. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"CAPS Resources" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Your CAPS Resources - Order #${order._id}`,
        html: emailHTML
      });

      return true;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  // Serve PDF download with token verification
  async servePDF(token) {
    const Order = require('../models/Order');
    
    // Find order with this token
    const order = await Order.findOne({
      'downloadLinks.token': token
    }).populate('items.product');

    if (!order) {
      throw new Error('Invalid download link');
    }

    // Find the specific download link
    const downloadLink = order.downloadLinks.find(link => link.token === token);
    
    if (!downloadLink) {
      throw new Error('Download link not found');
    }

    // Check expiry
    if (new Date() > downloadLink.expiresAt) {
      throw new Error('Download link has expired');
    }

    // Check download limit
    if (downloadLink.downloads >= 5) {
      throw new Error('Download limit reached');
    }

    // Get product
    const product = order.items.find(
      item => item.product._id.toString() === downloadLink.product.toString()
    ).product;

    // Increment download count
    downloadLink.downloads += 1;
    await order.save();

    // Return file path
    const filePath = path.join(this.pdfStoragePath, product.pdfFileName);
    
    // Check if file exists
    try {
      await fs.access(filePath);
      return {
        filePath,
        fileName: product.pdfFileName,
        product
      };
    } catch (error) {
      throw new Error('PDF file not found');
    }
  }
}

module.exports = new PDFService();

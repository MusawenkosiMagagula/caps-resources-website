const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/User');

class PayFastService {
  constructor() {
    this.merchantId = process.env.PAYFAST_MERCHANT_ID;
    this.merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    this.passphrase = process.env.PAYFAST_PASSPHRASE;
    this.sandbox = process.env.PAYFAST_SANDBOX === 'true';
    this.baseUrl = this.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
  }

  // Generate payment signature
  generateSignature(data, passphrase = null) {
    let pfOutput = '';
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== '') {
          pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
        }
      }
    }

    // Remove last &
    pfOutput = pfOutput.slice(0, -1);

    if (passphrase) {
      pfOutput += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
    }

    return crypto.createHash('md5').update(pfOutput).digest('hex');
  }

  // Create payment request
  async createPayment(order, user) {
    const paymentData = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/webhook`,
      
      // Order details
      m_payment_id: order._id.toString(),
      amount: order.totalAmount.toFixed(2),
      item_name: `CAPS Resources - Order ${order._id}`,
      item_description: `${order.items.length} educational resource(s)`,
      
      // User details
      email_address: user.email,
      name_first: user.name.split(' ')[0],
      name_last: user.name.split(' ').slice(1).join(' ') || user.name.split(' ')[0],
      
      // Additional
      email_confirmation: 1,
      confirmation_address: user.email
    };

    // Generate signature
    paymentData.signature = this.generateSignature(paymentData, this.passphrase);

    return {
      url: this.baseUrl,
      data: paymentData
    };
  }

  // Verify payment notification
  verifyPayment(postData) {
    const signature = postData.signature;
    delete postData.signature;

    const calculatedSignature = this.generateSignature(postData, this.passphrase);
    return signature === calculatedSignature;
  }

  // Validate payment from PayFast
  async validatePayment(data) {
    const pfParamString = Object.keys(data)
      .filter(key => key !== 'signature')
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    const pfHost = this.sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';

    try {
      const response = await axios.post(
        `https://${pfHost}/eng/query/validate`,
        pfParamString,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data === 'VALID';
    } catch (error) {
      console.error('PayFast validation error:', error);
      return false;
    }
  }
}

module.exports = new PayFastService();

const crypto = require('crypto');
const razorpay = require('../config/razorpay');

const createRazorpayOrder = async (amountInINR, receiptId) => {
  try {
    const options = {
      amount: Math.round(amountInINR * 100), // convert to paise
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1
    };

    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_demo12345678') {
      // Mock order creation for demo mode
      return {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        currency: 'INR',
        receipt: receiptId,
        status: 'created'
      };
    }

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Could not create Razorpay order: ' + error.message);
  }
};

const verifyRazorpaySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_demo12345678' || razorpayOrderId.startsWith('order_mock_')) {
    return true; // Auto-pass mock verification
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature
};

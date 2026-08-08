const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const calculatePrice = require("../utils/calculatePrice");

async function createOrder (req, res) {
  try {
    const {deliveryType, weight, priority } = req.body;

    const amount = calculatePrice( deliveryType, weight, priority);
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};


async function verifyPayment (req, res){

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment Verified",
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Payment Verification Error",
    });
  }
};

module.exports = {createOrder, verifyPayment};

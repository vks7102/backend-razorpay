const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method not allowed" });
  }

  const { amount, currency, receipt } = req.body;

  try {
    const order = await instance.orders.create({
      amount,
      currency,
      receipt,
    });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed", details: err });
  }
};

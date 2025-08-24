const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { amount, noteId, userId } = req.body;

    if (!amount || !noteId || !userId)
      return res.status(400).json({ error: "Missing required parameters" });

    const receipt = `note_${noteId}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt,
      payment_capture: 1, // auto-capture
      notes: { noteId, userId },
    });

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

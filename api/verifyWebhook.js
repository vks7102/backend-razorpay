import crypto from "crypto";

export default function handler(req, res) {
  const secret = process.env.WEBHOOK_SECRET;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("✅ Webhook verified:", req.body);
    // Save payment details in Firestore or DB
    return res.status(200).json({ status: "ok" });
  } else {
    console.log("❌ Webhook verification failed");
    return res.status(400).json({ status: "failed" });
  }
}

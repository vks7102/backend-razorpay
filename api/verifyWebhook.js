import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // Disable Vercel's default body parsing
  },
};

export default async function handler(req, res) {
  const secret = process.env.WEBHOOK_SECRET;

  let rawBody = "";

  // Collect raw body stream
  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", resolve);
    req.on("error", reject);
  });

  const receivedSignature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (receivedSignature === expectedSignature) {
    console.log("✅ Webhook verified:", JSON.parse(rawBody));
    // Save to DB here
    return res.status(200).json({ status: "ok" });
  } else {
    console.log("❌ Webhook verification failed");
    return res.status(400).json({ status: "failed" });
  }
}

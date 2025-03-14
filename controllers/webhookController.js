const stripe = require("../config/stripe");
const publishToQueue = require("../config/rabbitMQ");

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Received Stripe Webhook Event:", event.type);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  publishToQueue(event);

  res.json({ received: true });
};

const stripe = require("../config/stripe");
const { fetchPastTransactions } = require("../models/transactionModel");

const createPaymentIntent = async (payment_method, amount) => {
  try {
    const chargeAmount = amount * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: chargeAmount,
      currency: "usd",
      payment_method,
      confirmation_method: "automatic",
      confirm: false,
    });

    const response = {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      requiresAction: paymentIntent.status === "requires_action",
    };

    return { success: true, data: response };
  } catch (error) {
    console.error("Payment Intent Error:", error);
    return { success: false, message: "Payment Intent Creation Failed" };
  }
};

const refundPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return { success: false, message: "Payment is not eligible for refund" };
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return { success: true, data: refund };
  } catch (error) {
    console.error("Refund Error:", error);
    return { success: false, message: "Refund Failed" };
  }
};

const getPastTransactions = async () => {
  try {
    const transactions = await fetchPastTransactions();
    return transactions;
  } catch (error) {
    console.error("Error fetching past transactions:", error);
    throw error;
  }
};

module.exports = { createPaymentIntent, refundPayment, getPastTransactions };

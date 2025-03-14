const { storeTransaction } = require("../models/transactionModel");

module.exports = async function handlePaymentFailure(event) {
  console.log("Payment Failure Event:", event);
  const paymentFailed = event.data.object;

  await storeTransaction({
    status: "failure",
    id: paymentFailed.id,
    amount: paymentFailed.amount,
    error: paymentFailed.last_payment_error?.message || "Unknown error",
  });
};

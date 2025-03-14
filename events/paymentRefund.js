const { updateTransactionStatus } = require("../models/transactionModel");

module.exports = async function handleRefund(event) {
  console.log("Refund Processed Event:", event);
  const refund = event.data.object;
  const transactionId = refund.payment_intent;

  const refundData = {
    status: "refunded",
    id: refund.id,
    amount: refund.amount,
    payment_intent: refund.payment_intent,
    receipt_url: refund.receipt_url,
  };

  await updateTransactionStatus(transactionId, refundData);
};

const { storeTransaction } = require("../models/transactionModel");

module.exports = async function handlePaymentSuccess(event) {
  console.log("Payment Success Event:", event);
  const charge = event.data.object;

  await storeTransaction({
    status: "success",
    id: charge.id,
    amount: charge.amount,
    payment_method: charge.payment_method,
    receipt_url: charge.receipt_url,
    customer: charge.customer,
  });
};

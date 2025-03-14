const paymentService = require("../service/paymentService");

exports.createPaymentIntent = async (req, res) => {
  const { payment_method } = req.body;
  const amount = 50;
  const result = await paymentService.createPaymentIntent(
    payment_method,
    amount
  );

  if (result.success) {
    res.send(result.data);
  } else {
    res.status(500).send(result.message);
  }
};

exports.refundPayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  const result = await paymentService.refundPayment(paymentIntentId);

  if (result.success) {
    res.send(result.data);
  } else {
    res.status(400).send(result.message);
  }
};

exports.getPastTransactions = async (req, res) => {
  try {
    const transactions = await paymentService.getPastTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching past transactions:", error);
    res.status(500).json({ message: "Failed to fetch past transactions" });
  }
};

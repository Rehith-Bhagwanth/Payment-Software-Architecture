const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post("/refund-payment", paymentController.refundPayment);
router.get("/past-transactions", paymentController.getPastTransactions);

module.exports = router;

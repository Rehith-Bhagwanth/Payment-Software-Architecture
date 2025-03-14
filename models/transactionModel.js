const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    payment_method: { type: String },
    receipt_url: { type: String },
    customer: { type: String },
    error: { type: String },
    payment_intent: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

const storeTransaction = async (transactionData) => {
  try {
    const newTransaction = new Transaction(transactionData);
    await newTransaction.save();
    console.log("Transaction stored successfully");
  } catch (error) {
    console.error("Error storing transaction:", error);
  }
};

const updateTransactionStatus = async (transactionId, updateData) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { id: transactionId },
      updateData,
      { new: true }
    );

    if (!updatedTransaction) {
      console.log("Transaction not found for refund:", transactionId);
    } else {
      console.log("Transaction updated successfully");
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
};

const fetchPastTransactions = async () => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return transactions;
  } catch (error) {
    console.error("Error fetching past transactions:", error);
    throw error;
  }
};

module.exports = {
  Transaction,
  storeTransaction,
  updateTransactionStatus,
  fetchPastTransactions,
};

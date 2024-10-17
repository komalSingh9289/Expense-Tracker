import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true, // This distinguishes income and expense
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  file: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;

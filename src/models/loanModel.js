import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  maxLoan: { type: Number, required: true },
  loanPeriod: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Loan', loanSchema);

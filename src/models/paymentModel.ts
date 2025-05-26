import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  userId: { type: Number, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = model('Payment', paymentSchema);

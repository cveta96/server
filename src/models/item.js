import { Schema, model } from 'mongoose';

const ItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  priceHistory: [
    {
      price: {
        type: Number,
      },
      date: {
        type: Date,
      },
    },
  ],
});

export default model('Item', ItemSchema);

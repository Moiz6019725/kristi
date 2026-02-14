import mongoose from 'mongoose';

const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL to the uploaded image
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, {
  timestamps: true,
});

export const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

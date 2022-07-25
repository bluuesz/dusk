import * as mongoose from 'mongoose';

export interface Loyalty {
  pointsPerMinute: number;
  streamer: string;
}

/// loyalty config
const LoyaltySchema = new mongoose.Schema<Loyalty>(
  {
    pointsPerMinute: {
      type: Number,
      required: true,
    },
    streamer: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Loyalty',
  }
);

const LoyaltyModel = mongoose.model<Loyalty>('Loyalty', LoyaltySchema);

export default LoyaltyModel;

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
      default: 10,
      required: true,
    },
    streamer: {
      type: String,
      unique: true,
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

export const findStreamerLoyaltyConfigBySolanaAddress = (streamer: string) =>
  LoyaltyModel.findOne({ streamer: { _eq: streamer } });

export default LoyaltyModel;

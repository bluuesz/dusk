import * as mongoose from 'mongoose';

export interface Donate {
  _id: string;
  accountId: string;
  userAddress: string;
  streamerAddress: string;
  message: string;
  amount: number;
  timestamps: number;
}

const DonateSchema = new mongoose.Schema<Donate>(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
    },
    userAddress: {
      type: String,
      required: true,
    },
    streamerAddress: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Donate',
  }
);

const DonateModel = mongoose.model<Donate>('Donate', DonateSchema);

export default DonateModel;

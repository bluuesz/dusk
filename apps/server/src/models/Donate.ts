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
      required: true,
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

export const create = (donate: Partial<Donate>) => DonateModel.create(donate);
export const findByStreamerAddress = (streamerAddress: string) =>
  DonateModel.find({ streamerAddress: { _eq: streamerAddress } });

export default DonateModel;

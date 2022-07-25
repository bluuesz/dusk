import * as mongoose from 'mongoose';

export interface User {
  _id: string;
  username: string;
  solanaAddress: string;
  twitchId?: string;
  isStreamer: boolean;
}

const UserSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: false,
      unique: true,
    },
    solanaAddress: {
      type: String,
      required: false,
      unique: true,
    },
    twitchId: {
      type: String,
      unique: true,
      required: false,
    },
    isStreamer: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'User',
  }
);

const UserModel = mongoose.model<User>('User', UserSchema);

export const findStreamerBySolanaAddress = (address: string) =>
  UserModel.findOne({ solanaAddress: { _eq: address }, isStreamer: true });
export const findStreamers = () => UserModel.find({ isStreamer: true });

export default UserModel;

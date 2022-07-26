import * as mongoose from 'mongoose';

export interface Points {
  points: number;
  user: string;
  streamer: string;
}

const PointsSchema = new mongoose.Schema<Points>(
  {
    user: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    streamer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Points',
  }
);

const PointsModel = mongoose.model<Points>('Points', PointsSchema);

export const create = (points: Partial<Points>) => PointsModel.create(points);
export const findUserPointsFromStreamer = (user: string, streamer: string) =>
  PointsModel.findOne({
    user,
    streamer,
  });
export const updatePoints = (user: string, streamer: string, points: number) =>
  PointsModel.updateMany(
    { user, streamer },
    {
      $inc: {
        points,
      },
    }
  );

export default PointsModel;

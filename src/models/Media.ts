import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;

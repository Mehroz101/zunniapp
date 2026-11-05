import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },
    contentType: {
      type: String,
      required: [true, 'Content-Type is required'],
      trim: true,
      lowercase: true,
    },
    size: {
      type: Number,
      required: [true, 'File size in bytes is required'],
      max: [16 * 1024 * 1024, 'Image size exceeds MongoDB 16MB document boundary'],
    },
    data: {
      type: Buffer,
      required: [true, 'Binary image buffer is required'],
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.data; // Never serialize heavy binary buffer in JSON API responses
        return ret;
      },
    },
  }
);

// Virtual URL property pointing to native streaming route
MediaSchema.virtual('url').get(function (this: IMedia) {
  return `/api/images/${this._id.toString()}`;
});

// Ensure hot reload in Next.js development doesn't re-compile existing model
export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;

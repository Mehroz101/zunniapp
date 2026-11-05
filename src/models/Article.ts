import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';

export interface IArticleAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  coverImageId?: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  author: IArticleAuthor;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  readingTime?: number;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    coverImageId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    author: {
      name: {
        type: String,
        default: 'TOOLty Editorial Team',
        trim: true,
      },
      avatar: {
        type: String,
        default: '',
        trim: true,
      },
      bio: {
        type: String,
        default: '',
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      trim: true,
      default: '',
    },
    metaDescription: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-validate hook for slug generation & reading time
ArticleSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true, trim: true });
  }

  if (this.content && (!this.readingTime || this.isModified('content'))) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;

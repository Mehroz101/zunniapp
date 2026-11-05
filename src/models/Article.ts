import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string; // Sanitized HTML from Tiptap
  type: 'guide' | 'news';
  category: string;
  featuredImage?: string; // Points to /api/images/[id] or external URL
  seo: {
    title?: string;
    description?: string;
  };
  readingTime: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['guide', 'news'], default: 'guide', index: true },
    category: { type: String, required: true, trim: true },
    featuredImage: { type: String, default: '' },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    readingTime: { type: Number, default: 3 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  },
  { timestamps: true }
);

ArticleSchema.index({ type: 1, slug: 1, status: 1 });

export const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;

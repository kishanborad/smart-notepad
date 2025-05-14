import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPublic?: boolean;
  userId: mongoose.Types.ObjectId;
  status?: 'active' | 'archived' | 'deleted';
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'personal'
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#ffffff'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const Note = mongoose.model<INote>('Note', noteSchema); 
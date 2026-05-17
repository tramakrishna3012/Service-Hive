import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'sales';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true, index: true },
        name: String,
        role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
        passwordHash: String,
        provider: { type: String, default: 'credentials' }, // optional
    },
    { timestamps: true }
);

export default (mongoose.models.User as mongoose.Model<any>) ||
mongoose.model('User', UserSchema);

import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    passwordHash: { type: String },
    role: { type: String, enum: ['admin','editor','user'], default: 'user' }
}, { timestamps: true });

export type UserDoc = {
    _id: string; email: string; name?: string; role: 'admin'|'editor'|'user';
}
export default models.User || model('User', UserSchema);

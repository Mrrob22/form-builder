import { Schema, model, models } from 'mongoose';


export type FieldType = 'text' | 'number' | 'textarea';


const FieldSchema = new Schema({
    id: { type: String, required: true },
    type: { type: String, enum: ['text','number','textarea'], required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: String,
    required: { type: Boolean, default: false },
    minLength: Number,
    maxLength: Number,
    rows: Number,
    min: Number,
    max: Number,
    step: Number,
}, { _id: false });


const FormSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    fields: { type: [FieldSchema], default: [] },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: String },
}, { timestamps: true });


export default models.Form || model('Form', FormSchema);
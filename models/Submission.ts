import { Schema, model, models } from 'mongoose';


const SubmissionSchema = new Schema({
    formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
    payload: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });


export default models.Submission || model('Submission', SubmissionSchema);
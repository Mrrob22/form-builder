import mongoose, { Schema } from 'mongoose';

const SubmissionSchema = new Schema(
    {
        formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
        payload: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

export default (mongoose.models.Submission as mongoose.Model<any>) ||
mongoose.model('Submission', SubmissionSchema);

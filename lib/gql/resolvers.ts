import FormModel from '@/models/Form';
import SubmissionModel from '@/models/Submission';
import { dbConnect } from '@/lib/db';
import { FormZ } from '@/lib/zodSchemas';
import { GraphQLJSON } from 'graphql-scalars';

export const resolvers = {
    JSON: GraphQLJSON,

    Query: {
        forms: async (_: any, { published }: { published?: boolean }) => {
            await dbConnect();
            const q: any = {};
            q.isPublished = published;
            return FormModel.find(q).sort({ createdAt: -1 });
        },
        formById: async (_: any, { id }: { id: string }) => {
            await dbConnect();
            return FormModel.findById(id);
        },
        formBySlug: async (_: any, { slug }: { slug: string }) => {
            await dbConnect();
            return FormModel.findOne({ slug });
        },
        submissions: async (_: any, { formId }: { formId: string }) => {
            await dbConnect();
            return SubmissionModel.find({ formId }).sort({ createdAt: -1 });
        },
    },

    Mutation: {
        createForm: async (_: any, { input }: any) => {
            await dbConnect();
            const parsed = FormZ.parse(input);
            return FormModel.create(parsed);
        },
        updateForm: async (_: any, { id, input }: any) => {
            await dbConnect();
            const parsed = FormZ.parse(input);
            const updated = await FormModel.findByIdAndUpdate(id, parsed, { new: true });
            return updated;
        },
        deleteForm: async (_: any, { id }: any) => {
            await dbConnect();
            await FormModel.findByIdAndDelete(id);
            return true;
        },
        publishForm: async (_: any, { id, value }: any) => {
            await dbConnect();
            const updated = await FormModel.findByIdAndUpdate(
                id,
                { isPublished: value },
                { new: true }
            );
            return updated;
        },
        createSubmission: async (_: any, { formId, payload }: any) => {
            await dbConnect();
            return SubmissionModel.create({ formId, payload });
        },
    },
};

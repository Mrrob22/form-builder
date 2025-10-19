import Form from '@/models/Form';
import Submission from '@/models/Submission';
import { dbConnect } from '@/lib/db';

export const resolvers = {
    Query: {
        forms: async () => { await dbConnect(); return Form.find(); },
        formBySlug: async (_:any,{slug}:{slug:string}) => { await dbConnect(); return Form.findOne({slug}); },
    },
    Mutation: {
        createForm: async (_:any,{input}:any) => { await dbConnect(); return Form.create(input); },
        createSubmission: async (_:any,{formId,payload}:any)=>{await dbConnect();return Submission.create({formId,payload});}
    }
};

import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from '@/lib/gql/schema';
import { resolvers } from '@/lib/gql/resolvers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { handleRequest } = createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: '/api/graphql',
    maskedErrors: process.env.NODE_ENV === 'production',
    logging: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});

export { handleRequest as GET, handleRequest as POST };

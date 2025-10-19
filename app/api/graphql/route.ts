import { createSchema, createYoga } from 'graphql-yoga';
import { NextResponse } from 'next/server';
import {resolvers} from '@/lib/gql/resolvers';
import {typeDefs} from '@/lib/gql/schema';

const yoga = createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: '/api/graphql',
    fetchAPI: { Response: NextResponse },
});
export { yoga as GET, yoga as POST };

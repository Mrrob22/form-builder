import { createSchema } from 'graphql-yoga';

export const typeDefs = `
  scalar JSON

  enum FieldType { text number textarea }

  type Field {
    id: ID!
    type: FieldType!
    name: String!
    label: String!
    placeholder: String
    required: Boolean
    minLength: Int
    maxLength: Int
    rows: Int
    min: Float
    max: Float
    step: Float
  }

  type Form {
    _id: ID!
    title: String!
    slug: String!
    description: String
    fields: [Field!]!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Submission {
    _id: ID!
    formId: ID!
    payload: JSON!
    createdAt: String!
  }

  type Query {
    forms(published: Boolean): [Form!]!
    formById(id: ID!): Form
    formBySlug(slug: String!): Form
    submissions(formId: ID!): [Submission!]!
  }

  input FieldInput {
    id: ID!
    type: FieldType!
    name: String!
    label: String!
    placeholder: String
    required: Boolean
    minLength: Int
    maxLength: Int
    rows: Int
    min: Float
    max: Float
    step: Float
  }

  input FormInput {
    title: String!
    slug: String!
    description: String
    fields: [FieldInput!]!
    isPublished: Boolean
  }

  type Mutation {
    createForm(input: FormInput!): Form!
    updateForm(id: ID!, input: FormInput!): Form!
    deleteForm(id: ID!): Boolean!
    publishForm(id: ID!, value: Boolean!): Form!
    createSubmission(formId: ID!, payload: JSON!): Submission!
  }
`;

export const schema = createSchema({ typeDefs });

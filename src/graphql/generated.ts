import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  GeoJSON: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ApplicationError = {
  message: Scalars['String']['output'];
};

export type ConflictError = ApplicationError & {
  __typename: 'ConflictError';
  message: Scalars['String']['output'];
};

export type Coordinate = {
  __typename: 'Coordinate';
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
};

export type CoordinateInput = {
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
};

export type CreateFabricInput = {
  center: CoordinateInput;
};

export type CreateFabricResult = Fabric | UnauthorizedError;

export type CreateProposalInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  fabricId: Scalars['ID']['input'];
  slug: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateProposalResult = Proposal | UnauthorizedError;

export type DeleteFabricElementInput = {
  elementId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};

export type DeleteFabricElementResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type DeleteFabricInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFabricResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type DeleteProposalInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type Fabric = {
  __typename: 'Fabric';
  createdAt: Scalars['DateTime']['output'];
  elements: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  locationCity: Scalars['String']['output'];
  locationCountry: Scalars['String']['output'];
  locationRegion: Scalars['String']['output'];
  originBearing: Scalars['Float']['output'];
  originCenter: Coordinate;
  originZoom: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewportBearing: Scalars['Float']['output'];
  viewportCenter: Coordinate;
  viewportZoom: Scalars['Float']['output'];
};

export type FabricResult = Fabric | NotFoundError;

export type FieldError = {
  __typename: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ForbiddenError = ApplicationError & {
  __typename: 'ForbiddenError';
  message: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResult = ConflictError | UnauthorizedError | User;

export type Mutation = {
  __typename: 'Mutation';
  createFabric: CreateFabricResult;
  createProposal: CreateProposalResult;
  deleteFabric: DeleteFabricResult;
  deleteFabricElement: DeleteFabricElementResult;
  deleteProposal: DeleteProposalResult;
  login: LoginResult;
  logout: Scalars['Boolean']['output'];
  publishProposal: PublishProposalResult;
  register: RegisterResult;
  saveView: SaveViewResult;
  syncViewport: SyncViewportResult;
  unpublishProposal: UnpublishProposalResult;
  updateFabricElements: UpdateFabricElementsResult;
  updateFabricTitle: UpdateFabricTitleResult;
  updateProposal: UpdateProposalResult;
};


export type MutationCreateFabricArgs = {
  input: CreateFabricInput;
};


export type MutationCreateProposalArgs = {
  input: CreateProposalInput;
};


export type MutationDeleteFabricArgs = {
  input: DeleteFabricInput;
};


export type MutationDeleteFabricElementArgs = {
  input: DeleteFabricElementInput;
};


export type MutationDeleteProposalArgs = {
  input: DeleteProposalInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationPublishProposalArgs = {
  input: PublishProposalInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSaveViewArgs = {
  input: SaveViewInput;
};


export type MutationSyncViewportArgs = {
  input: SyncViewportInput;
};


export type MutationUnpublishProposalArgs = {
  input: UnpublishProposalInput;
};


export type MutationUpdateFabricElementsArgs = {
  input: UpdateFabricElementsInput;
};


export type MutationUpdateFabricTitleArgs = {
  input: UpdateFabricTitleInput;
};


export type MutationUpdateProposalArgs = {
  input: UpdateProposalInput;
};

export type MyFabricsResponse = {
  __typename: 'MyFabricsResponse';
  data: Array<Fabric>;
};

export type MyFabricsResult = MyFabricsResponse | UnauthorizedError;

export type MyProposalsResponse = {
  __typename: 'MyProposalsResponse';
  data: Array<Proposal>;
};

export type MyProposalsResult = MyProposalsResponse | UnauthorizedError;

export type NotFoundError = ApplicationError & {
  __typename: 'NotFoundError';
  message: Scalars['String']['output'];
};

export type Proposal = {
  __typename: 'Proposal';
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  fabricId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isPublished: Scalars['Boolean']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProposalBySlugResult = NotFoundError | Proposal;

export type ProposalResult = NotFoundError | Proposal;

export type PublishProposalInput = {
  id: Scalars['ID']['input'];
};

export type PublishProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type Query = {
  __typename: 'Query';
  fabric: FabricResult;
  me?: Maybe<User>;
  myFabrics: MyFabricsResult;
  myProposals: MyProposalsResult;
  proposal: ProposalResult;
  proposalBySlug: ProposalBySlugResult;
  proposalsByFabricId: Array<Proposal>;
  user: UserResult;
};


export type QueryFabricArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyFabricsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProposalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProposalBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryProposalsByFabricIdArgs = {
  fabricId: Scalars['ID']['input'];
  publishedOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterResult = ConflictError | User | ValidationError;

export type SaveViewInput = {
  id: Scalars['ID']['input'];
};

export type SaveViewResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type SyncViewportInput = {
  bearing: Scalars['Float']['input'];
  center: CoordinateInput;
  id: Scalars['ID']['input'];
  zoom: Scalars['Float']['input'];
};

export type SyncViewportResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type UnauthorizedError = ApplicationError & {
  __typename: 'UnauthorizedError';
  message: Scalars['String']['output'];
};

export type UnpublishProposalInput = {
  id: Scalars['ID']['input'];
};

export type UnpublishProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type UpdateFabricElementsInput = {
  elements: Array<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateFabricElementsResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type UpdateFabricTitleInput = {
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type UpdateFabricTitleResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type UpdateProposalInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type User = {
  __typename: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type UserResult = NotFoundError | User;

export type ValidationError = {
  __typename: 'ValidationError';
  errors: Array<FieldError>;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename: 'Mutation', login:
    | { __typename: 'ConflictError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
    | { __typename: 'User', id: string, name: string, email: string, role: string }
   };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename: 'Mutation', register:
    | { __typename: 'ConflictError', message: string }
    | { __typename: 'User', id: string, name: string, email: string, role: string }
    | { __typename: 'ValidationError', errors: Array<{ __typename: 'FieldError', field: string, message: string }> }
   };

export type UpdateFabricTitleMutationVariables = Exact<{
  input: UpdateFabricTitleInput;
}>;


export type UpdateFabricTitleMutation = { __typename: 'Mutation', updateFabricTitle:
    | { __typename: 'Fabric', id: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type SyncViewportMutationVariables = Exact<{
  input: SyncViewportInput;
}>;


export type SyncViewportMutation = { __typename: 'Mutation', syncViewport:
    | { __typename: 'Fabric', id: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type CreateFabricMutationVariables = Exact<{
  input: CreateFabricInput;
}>;


export type CreateFabricMutation = { __typename: 'Mutation', createFabric:
    | { __typename: 'Fabric', id: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me?: { __typename: 'User', id: string, name: string, email: string, role: string } | null };

export type RecentFabricsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentFabricsQuery = { __typename: 'Query', myFabrics:
    | { __typename: 'MyFabricsResponse', data: Array<{ __typename: 'Fabric', updatedAt: string, id: string, locationCity: string, locationCountry: string, locationRegion: string, title: string }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type DeleteFabricElementMutationVariables = Exact<{
  input: DeleteFabricElementInput;
}>;


export type DeleteFabricElementMutation = { __typename: 'Mutation', deleteFabricElement:
    | { __typename: 'Fabric', id: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type GetFabricQueryVariables = Exact<{
  fabricId: Scalars['ID']['input'];
}>;


export type GetFabricQuery = { __typename: 'Query', fabric:
    | { __typename: 'Fabric', id: string, title: string, viewportBearing: number, viewportZoom: number, elements: any, viewportCenter: { __typename: 'Coordinate', lng: number, lat: number } }
    | { __typename: 'NotFoundError', message: string }
   };

export type UpdateFabricElementsMutationVariables = Exact<{
  input: UpdateFabricElementsInput;
}>;


export type UpdateFabricElementsMutation = { __typename: 'Mutation', updateFabricElements:
    | { __typename: 'Fabric', id: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateFabricTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricTitleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricTitleMutation, UpdateFabricTitleMutationVariables>;
export const SyncViewportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncViewport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncViewportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncViewport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SyncViewportMutation, SyncViewportMutationVariables>;
export const CreateFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFabricInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFabricMutation, CreateFabricMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const RecentFabricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentFabrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFabrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyFabricsResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationCountry"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RecentFabricsQuery, RecentFabricsQueryVariables>;
export const DeleteFabricElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFabricElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteFabricElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFabricElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteFabricElementMutation, DeleteFabricElementMutationVariables>;
export const GetFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewportBearing"}},{"kind":"Field","name":{"kind":"Name","value":"viewportCenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}}]}},{"kind":"Field","name":{"kind":"Name","value":"viewportZoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GetFabricQuery, GetFabricQueryVariables>;
export const UpdateFabricElementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricElements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricElementsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricElements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricElementsMutation, UpdateFabricElementsMutationVariables>;
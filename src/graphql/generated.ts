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
  elements?: InputMaybe<Scalars['JSON']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  zoom?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateFabricResult = Fabric | UnauthorizedError;

export type DashboardStats = {
  __typename: 'DashboardStats';
  fabricCount: Scalars['Int']['output'];
  proposalCount: Scalars['Int']['output'];
  proposalLikesDelta: Scalars['Int']['output'];
  proposalViewsDelta: Scalars['Int']['output'];
  totalProposalLikes: Scalars['Int']['output'];
  totalProposalViews: Scalars['Int']['output'];
  unpublishedProposalCount: Scalars['Int']['output'];
};

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
  center: Coordinate;
  createdAt: Scalars['DateTime']['output'];
  elements: Scalars['JSON']['output'];
  hasProposal: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  locationCity: Scalars['String']['output'];
  locationCountry: Scalars['String']['output'];
  locationRegion: Scalars['String']['output'];
  proposal?: Maybe<Proposal>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zoom: Scalars['Float']['output'];
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

export type LikeProposalInput = {
  proposalId: Scalars['ID']['input'];
};

export type LikeProposalResult = ConflictError | ProposalLike | UnauthorizedError;

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResult = ConflictError | UnauthorizedError | User;

export type Mutation = {
  __typename: 'Mutation';
  createFabric: CreateFabricResult;
  deleteFabric: DeleteFabricResult;
  deleteProposal: DeleteProposalResult;
  likeProposal: LikeProposalResult;
  login: LoginResult;
  logout: Scalars['Boolean']['output'];
  publishProposal: PublishProposalResult;
  recordProposalView?: Maybe<RecordProposalViewResult>;
  register: RegisterResult;
  saveDraftProposal: SaveDraftProposalResult;
  syncViewport: SyncViewportResult;
  unlikeProposal: UnlikeProposalResult;
  updateFabricElements: UpdateFabricElementsResult;
  updateFabricThumbnail: UpdateFabricThumbnailResult;
  updateFabricTitle: UpdateFabricTitleResult;
};


export type MutationCreateFabricArgs = {
  input: CreateFabricInput;
};


export type MutationDeleteFabricArgs = {
  input: DeleteFabricInput;
};


export type MutationDeleteProposalArgs = {
  input: DeleteProposalInput;
};


export type MutationLikeProposalArgs = {
  input: LikeProposalInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationPublishProposalArgs = {
  input: PublishProposalInput;
};


export type MutationRecordProposalViewArgs = {
  input: RecordProposalViewInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSaveDraftProposalArgs = {
  input: SaveDraftProposalInput;
};


export type MutationSyncViewportArgs = {
  input: SyncViewportInput;
};


export type MutationUnlikeProposalArgs = {
  input: UnlikeProposalInput;
};


export type MutationUpdateFabricElementsArgs = {
  input: UpdateFabricElementsInput;
};


export type MutationUpdateFabricThumbnailArgs = {
  input: UpdateFabricThumbnailInput;
};


export type MutationUpdateFabricTitleArgs = {
  input: UpdateFabricTitleInput;
};

export type MyDashboardStatsResult = DashboardStats | UnauthorizedError;

export type MyFabricsPayload = {
  __typename: 'MyFabricsPayload';
  fabrics: Array<Fabric>;
  hasMore: Scalars['Boolean']['output'];
  total: Scalars['Int']['output'];
};

export type MyFabricsResult = MyFabricsPayload | UnauthorizedError;

export type MyProposalLikesResponse = {
  __typename: 'MyProposalLikesResponse';
  data: Array<ProposalLike>;
};

export type MyProposalLikesResult = MyProposalLikesResponse | UnauthorizedError;

export type MyProposalsPayload = {
  __typename: 'MyProposalsPayload';
  hasMore: Scalars['Boolean']['output'];
  proposals: Array<Proposal>;
  total: Scalars['Int']['output'];
};

export type MyProposalsResult = MyProposalsPayload | UnauthorizedError;

export type NotFoundError = ApplicationError & {
  __typename: 'NotFoundError';
  message: Scalars['String']['output'];
};

export type Proposal = {
  __typename: 'Proposal';
  categories: Array<ProposalCategory>;
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  fabricId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isLikedByMe: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  likeCount: Scalars['Int']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  snapshotCenter: Coordinate;
  snapshotElements: Scalars['JSON']['output'];
  snapshotLocationCity: Scalars['String']['output'];
  snapshotLocationCountry: Scalars['String']['output'];
  snapshotLocationRegion: Scalars['String']['output'];
  snapshotThumbnail: Scalars['String']['output'];
  snapshotZoom: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewCount: Scalars['Int']['output'];
};

export type ProposalBySlugResult = NotFoundError | Proposal;

export enum ProposalCategory {
  BikeInfrastructure = 'BIKE_INFRASTRUCTURE',
  Parking = 'PARKING',
  Pedestrian = 'PEDESTRIAN',
  Streetscape = 'STREETSCAPE',
  TrafficSafety = 'TRAFFIC_SAFETY',
  Transit = 'TRANSIT'
}

export type ProposalLike = {
  __typename: 'ProposalLike';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  proposalId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ProposalResult = NotFoundError | Proposal;

export enum ProposalStatusFilter {
  All = 'ALL',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type ProposalView = {
  __typename: 'ProposalView';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  proposalId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type PublishProposalInput = {
  categories: Array<ProposalCategory>;
  center: CoordinateInput;
  description?: InputMaybe<Scalars['String']['input']>;
  elements: Array<Scalars['JSON']['input']>;
  fabricId: Scalars['ID']['input'];
  thumbnail: Scalars['String']['input'];
  title: Scalars['String']['input'];
  zoom: Scalars['Float']['input'];
};

export type PublishProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type Query = {
  __typename: 'Query';
  fabric: FabricResult;
  me?: Maybe<User>;
  myDashboardStats: MyDashboardStatsResult;
  myFabrics: MyFabricsResult;
  myProposalLikes: MyProposalLikesResult;
  myProposals: MyProposalsResult;
  proposal: ProposalResult;
  proposalByFabricId?: Maybe<Proposal>;
  proposalBySlug: ProposalBySlugResult;
  user: UserResult;
};


export type QueryFabricArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyFabricsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyProposalsArgs = {
  categories?: InputMaybe<Array<ProposalCategory>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProposalStatusFilter>;
};


export type QueryProposalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProposalByFabricIdArgs = {
  fabricId: Scalars['ID']['input'];
  publishedOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryProposalBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RecordProposalViewInput = {
  proposalId: Scalars['ID']['input'];
};

export type RecordProposalViewResult = ProposalView | UnauthorizedError;

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterResult = ConflictError | User | ValidationError;

export type SaveDraftProposalInput = {
  categories?: InputMaybe<Array<ProposalCategory>>;
  center: CoordinateInput;
  description?: InputMaybe<Scalars['String']['input']>;
  elements: Array<Scalars['JSON']['input']>;
  fabricId: Scalars['ID']['input'];
  thumbnail: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  zoom: Scalars['Float']['input'];
};

export type SaveDraftProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type SyncViewportInput = {
  center: CoordinateInput;
  id: Scalars['ID']['input'];
  zoom: Scalars['Float']['input'];
};

export type SyncViewportResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type UnauthorizedError = ApplicationError & {
  __typename: 'UnauthorizedError';
  message: Scalars['String']['output'];
};

export type UnlikeProposalInput = {
  proposalId: Scalars['ID']['input'];
};

export type UnlikeProposalResult = NotFoundError | ProposalLike | UnauthorizedError;

export type UpdateFabricElementsInput = {
  elements: Array<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateFabricElementsResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type UpdateFabricThumbnailInput = {
  id: Scalars['ID']['input'];
  thumbnail: Scalars['String']['input'];
};

export type UpdateFabricThumbnailResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type UpdateFabricTitleInput = {
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type UpdateFabricTitleResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

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
    | { __typename: 'Fabric', id: string, title: string, updatedAt: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type UpdateFabricThumbnailMutationVariables = Exact<{
  input: UpdateFabricThumbnailInput;
}>;


export type UpdateFabricThumbnailMutation = { __typename: 'Mutation', updateFabricThumbnail:
    | { __typename: 'Fabric', id: string, thumbnail?: string | null }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type SyncViewportMutationVariables = Exact<{
  input: SyncViewportInput;
}>;


export type SyncViewportMutation = { __typename: 'Mutation', syncViewport:
    | { __typename: 'Fabric', id: string, zoom: number, thumbnail?: string | null, updatedAt: string, center: { __typename: 'Coordinate', lat: number, lng: number } }
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

export type MyDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyDashboardStatsQuery = { __typename: 'Query', myDashboardStats:
    | { __typename: 'DashboardStats', fabricCount: number, proposalCount: number, proposalLikesDelta: number, proposalViewsDelta: number, totalProposalLikes: number, totalProposalViews: number, unpublishedProposalCount: number }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type MyFabricsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MyFabricsQuery = { __typename: 'Query', myFabrics:
    | { __typename: 'MyFabricsPayload', total: number, hasMore: boolean, fabrics: Array<{ __typename: 'Fabric', id: string, hasProposal: boolean, locationCity: string, locationRegion: string, thumbnail?: string | null, title: string, updatedAt: string }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type MyProposalsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProposalStatusFilter>;
  categories?: InputMaybe<Array<ProposalCategory> | ProposalCategory>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MyProposalsQuery = { __typename: 'Query', myProposals:
    | { __typename: 'MyProposalsPayload', total: number, hasMore: boolean, proposals: Array<{ __typename: 'Proposal', id: string, title: string, updatedAt: string, viewCount: number, slug: string, likeCount: number, isPublished: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotThumbnail: string }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type RecentFabricsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentFabricsQuery = { __typename: 'Query', myFabrics:
    | { __typename: 'MyFabricsPayload', total: number, fabrics: Array<{ __typename: 'Fabric', updatedAt: string, id: string, locationCity: string, locationCountry: string, locationRegion: string, title: string, thumbnail?: string | null, hasProposal: boolean }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type RecentProposalsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentProposalsQuery = { __typename: 'Query', myProposals:
    | { __typename: 'MyProposalsPayload', total: number, proposals: Array<{ __typename: 'Proposal', id: string, title: string, slug: string, isPublished: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotThumbnail: string, updatedAt: string, likeCount: number }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type GetFabricQueryVariables = Exact<{
  fabricId: Scalars['ID']['input'];
}>;


export type GetFabricQuery = { __typename: 'Query', fabric:
    | { __typename: 'Fabric', id: string, title: string, zoom: number, elements: any, thumbnail?: string | null, center: { __typename: 'Coordinate', lng: number, lat: number }, proposal?: { __typename: 'Proposal', id: string, slug: string } | null }
    | { __typename: 'NotFoundError', message: string }
   };

export type ProposalByFabricIdQueryVariables = Exact<{
  fabricId: Scalars['ID']['input'];
}>;


export type ProposalByFabricIdQuery = { __typename: 'Query', proposalByFabricId?: { __typename: 'Proposal', id: string, slug: string } | null };

export type PublishProposalMutationVariables = Exact<{
  input: PublishProposalInput;
}>;


export type PublishProposalMutation = { __typename: 'Mutation', publishProposal:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, slug: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type SaveDraftProposalMutationVariables = Exact<{
  input: SaveDraftProposalInput;
}>;


export type SaveDraftProposalMutation = { __typename: 'Mutation', saveDraftProposal:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type UpdateFabricElementsMutationVariables = Exact<{
  input: UpdateFabricElementsInput;
}>;


export type UpdateFabricElementsMutation = { __typename: 'Mutation', updateFabricElements:
    | { __typename: 'Fabric', id: string, elements: any, updatedAt: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateFabricTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricTitleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricTitleMutation, UpdateFabricTitleMutationVariables>;
export const UpdateFabricThumbnailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricThumbnail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricThumbnailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricThumbnail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricThumbnailMutation, UpdateFabricThumbnailMutationVariables>;
export const SyncViewportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncViewport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncViewportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncViewport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SyncViewportMutation, SyncViewportMutationVariables>;
export const CreateFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFabricInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFabricMutation, CreateFabricMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const MyDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DashboardStats"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabricCount"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"proposalLikesDelta"}},{"kind":"Field","name":{"kind":"Name","value":"proposalViewsDelta"}},{"kind":"Field","name":{"kind":"Name","value":"totalProposalLikes"}},{"kind":"Field","name":{"kind":"Name","value":"totalProposalViews"}},{"kind":"Field","name":{"kind":"Name","value":"unpublishedProposalCount"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<MyDashboardStatsQuery, MyDashboardStatsQueryVariables>;
export const MyFabricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyFabrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFabrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyFabricsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"fabrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasProposal"}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<MyFabricsQuery, MyFabricsQueryVariables>;
export const MyProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalStatusFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categories"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalCategory"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"categories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categories"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyProposalsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyProposalsQuery, MyProposalsQueryVariables>;
export const RecentFabricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentFabrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFabrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyFabricsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationCountry"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"hasProposal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<RecentFabricsQuery, RecentFabricsQueryVariables>;
export const RecentProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentProposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyProposalsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RecentProposalsQuery, RecentProposalsQueryVariables>;
export const GetFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GetFabricQuery, GetFabricQueryVariables>;
export const ProposalByFabricIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProposalByFabricId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposalByFabricId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fabricId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<ProposalByFabricIdQuery, ProposalByFabricIdQueryVariables>;
export const PublishProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublishProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PublishProposalMutation, PublishProposalMutationVariables>;
export const SaveDraftProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveDraftProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveDraftProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveDraftProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SaveDraftProposalMutation, SaveDraftProposalMutationVariables>;
export const UpdateFabricElementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricElements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricElementsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricElements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricElementsMutation, UpdateFabricElementsMutationVariables>;
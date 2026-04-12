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

export enum AuthProvider {
  Google = 'GOOGLE',
  Local = 'LOCAL'
}

export type CommentLocation = {
  __typename: 'CommentLocation';
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type CommentLocationInput = {
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
  name: Scalars['String']['input'];
};

export enum CommentSortBy {
  MostLiked = 'MOST_LIKED',
  MostRecent = 'MOST_RECENT'
}

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
  mapStyle?: InputMaybe<MapStyle>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  zoom?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateFabricResult = Fabric | UnauthorizedError;

export type CreateFabricThumbnailUploadUrlInput = {
  contentType: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type CreateFabricThumbnailUploadUrlResult = ForbiddenError | NotFoundError | PresignedUploadResult | UnauthorizedError;

export type CreateProposalCommentInput = {
  body: Scalars['String']['input'];
  location?: InputMaybe<CommentLocationInput>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  proposalSlug: Scalars['String']['input'];
};

export type CreateProposalCommentResult = NotFoundError | ProposalComment | UnauthorizedError;

export type CreateProposalThumbnailUploadUrlInput = {
  contentType: Scalars['String']['input'];
  fabricId: Scalars['ID']['input'];
};

export type CreateProposalThumbnailUploadUrlResult = ForbiddenError | NotFoundError | PresignedUploadResult | UnauthorizedError;

export type CreateUserBannerUploadUrlInput = {
  contentType: Scalars['String']['input'];
};

export type CreateUserBannerUploadUrlResult = PresignedUploadResult | UnauthorizedError;

export type CreateUserProfilePictureUploadUrlInput = {
  contentType: Scalars['String']['input'];
};

export type CreateUserProfilePictureUploadUrlResult = PresignedUploadResult | UnauthorizedError;

export type DashboardStats = {
  __typename: 'DashboardStats';
  fabricCount: Scalars['Int']['output'];
  proposalCommentsDelta: Scalars['Int']['output'];
  proposalCount: Scalars['Int']['output'];
  proposalLikesDelta: Scalars['Int']['output'];
  proposalViewsDelta: Scalars['Int']['output'];
  totalProposalComments: Scalars['Int']['output'];
  totalProposalLikes: Scalars['Int']['output'];
  totalProposalViews: Scalars['Int']['output'];
  unpublishedProposalCount: Scalars['Int']['output'];
};

export type DeleteAccountResponse = {
  __typename: 'DeleteAccountResponse';
  data: Scalars['Boolean']['output'];
};

export type DeleteAccountResult = DeleteAccountResponse | NotFoundError | UnauthorizedError;

export type DeleteFabricInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFabricResult = ConflictError | Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type DeleteProposalCommentInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProposalCommentResult = ForbiddenError | NotFoundError | ProposalComment | UnauthorizedError;

export type DeleteProposalInput = {
  id: Scalars['ID']['input'];
};

export type DeleteProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type EditEmailInput = {
  email: Scalars['String']['input'];
};

export type EditEmailResult = NotFoundError | UnauthorizedError | User | ValidationError;

export type EditPasswordInput = {
  password: Scalars['String']['input'];
};

export type EditPasswordResult = NotFoundError | UnauthorizedError | User;

export type EditProfileInput = {
  bannerImageUrl: Scalars['String']['input'];
  bio: Scalars['String']['input'];
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
  profilePictureUrl: Scalars['String']['input'];
};

export type EditProfileResult = NotFoundError | UnauthorizedError | User;

export type ExploreProposalsPayload = {
  __typename: 'ExploreProposalsPayload';
  hasMore: Scalars['Boolean']['output'];
  proposals: Array<Proposal>;
  total: Scalars['Int']['output'];
};

export enum ExploreSortBy {
  Hottest = 'HOTTEST',
  MostLiked = 'MOST_LIKED',
  MostViewed = 'MOST_VIEWED',
  Recent = 'RECENT'
}

export type Fabric = {
  __typename: 'Fabric';
  center: Coordinate;
  createdAt: Scalars['DateTime']['output'];
  creator: User;
  elements: Scalars['JSON']['output'];
  hasProposal: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  locationCity: Scalars['String']['output'];
  locationCountry: Scalars['String']['output'];
  locationRegion: Scalars['String']['output'];
  locationRegionAbbr?: Maybe<Scalars['String']['output']>;
  mapStyle: MapStyle;
  proposal?: Maybe<Proposal>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zoom: Scalars['Float']['output'];
};

export type FabricResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

export type FieldError = {
  __typename: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ForbiddenError = ApplicationError & {
  __typename: 'ForbiddenError';
  message: Scalars['String']['output'];
};

export type GeocodeResult = {
  __typename: 'GeocodeResult';
  displayName: Scalars['String']['output'];
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
};

export type GoogleLoginInput = {
  accessToken: Scalars['String']['input'];
};

export type GoogleLoginResponse = {
  __typename: 'GoogleLoginResponse';
  isNewUser: Scalars['Boolean']['output'];
  user: User;
};

export type GoogleLoginResult = ConflictError | GoogleLoginResponse | UnauthorizedError;

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResult = ConflictError | UnauthorizedError | User;

export enum MapStyle {
  Dark = 'DARK',
  Default = 'DEFAULT',
  Light = 'LIGHT'
}

export type Mutation = {
  __typename: 'Mutation';
  createFabric: CreateFabricResult;
  createFabricThumbnailUploadUrl: CreateFabricThumbnailUploadUrlResult;
  createProposalComment: CreateProposalCommentResult;
  createProposalThumbnailUploadUrl: CreateProposalThumbnailUploadUrlResult;
  createUserBannerUploadUrl: CreateUserBannerUploadUrlResult;
  createUserProfilePictureUploadUrl: CreateUserProfilePictureUploadUrlResult;
  deleteAccount: DeleteAccountResult;
  deleteFabric: DeleteFabricResult;
  deleteProposal: DeleteProposalResult;
  deleteProposalComment: DeleteProposalCommentResult;
  editEmail: EditEmailResult;
  editPassword: EditPasswordResult;
  editProfile: EditProfileResult;
  googleLogin: GoogleLoginResult;
  login: LoginResult;
  logout: Scalars['Boolean']['output'];
  publishProposal: PublishProposalResult;
  recordProposalView?: Maybe<Proposal>;
  register: RegisterResult;
  saveDraftProposal: SaveDraftProposalResult;
  syncViewport: SyncViewportResult;
  toggleProposalCommentLike: ToggleProposalCommentLikeResult;
  toggleProposalLike: ToggleProposalLikeResult;
  unpublishProposal: UnpublishProposalResult;
  updateFabricElements: UpdateFabricElementsResult;
  updateFabricMapStyle: UpdateFabricMapStyleResult;
  updateFabricThumbnail: UpdateFabricThumbnailResult;
  updateFabricTitle: UpdateFabricTitleResult;
  updateProposalComment: UpdateProposalCommentResult;
};


export type MutationCreateFabricArgs = {
  input: CreateFabricInput;
};


export type MutationCreateFabricThumbnailUploadUrlArgs = {
  input: CreateFabricThumbnailUploadUrlInput;
};


export type MutationCreateProposalCommentArgs = {
  input: CreateProposalCommentInput;
};


export type MutationCreateProposalThumbnailUploadUrlArgs = {
  input: CreateProposalThumbnailUploadUrlInput;
};


export type MutationCreateUserBannerUploadUrlArgs = {
  input: CreateUserBannerUploadUrlInput;
};


export type MutationCreateUserProfilePictureUploadUrlArgs = {
  input: CreateUserProfilePictureUploadUrlInput;
};


export type MutationDeleteFabricArgs = {
  input: DeleteFabricInput;
};


export type MutationDeleteProposalArgs = {
  input: DeleteProposalInput;
};


export type MutationDeleteProposalCommentArgs = {
  input: DeleteProposalCommentInput;
};


export type MutationEditEmailArgs = {
  input: EditEmailInput;
};


export type MutationEditPasswordArgs = {
  input: EditPasswordInput;
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationGoogleLoginArgs = {
  input: GoogleLoginInput;
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


export type MutationToggleProposalCommentLikeArgs = {
  input: ToggleProposalCommentLikeInput;
};


export type MutationToggleProposalLikeArgs = {
  input: ToggleProposalLikeInput;
};


export type MutationUnpublishProposalArgs = {
  input: UnpublishProposalInput;
};


export type MutationUpdateFabricElementsArgs = {
  input: UpdateFabricElementsInput;
};


export type MutationUpdateFabricMapStyleArgs = {
  input: UpdateFabricMapStyleInput;
};


export type MutationUpdateFabricThumbnailArgs = {
  input: UpdateFabricThumbnailInput;
};


export type MutationUpdateFabricTitleArgs = {
  input: UpdateFabricTitleInput;
};


export type MutationUpdateProposalCommentArgs = {
  input: UpdateProposalCommentInput;
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

export type PresignedUploadResult = {
  __typename: 'PresignedUploadResult';
  publicUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Proposal = {
  __typename: 'Proposal';
  categories: Array<ProposalCategory>;
  commentCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  creator: User;
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
  snapshotLocationRegionAbbr?: Maybe<Scalars['String']['output']>;
  snapshotMapStyle: MapStyle;
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
  TrafficSafety = 'TRAFFIC_SAFETY',
  Transit = 'TRANSIT'
}

export type ProposalComment = {
  __typename: 'ProposalComment';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isLikedByMe: Scalars['Boolean']['output'];
  likeCount: Scalars['Int']['output'];
  location?: Maybe<CommentLocation>;
  parent?: Maybe<ProposalComment>;
  proposal: Proposal;
  replyCount: Scalars['Int']['output'];
  replyToComment?: Maybe<ProposalComment>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ProposalCommentLike = {
  __typename: 'ProposalCommentLike';
  comment: ProposalComment;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ProposalCommentsPayload = {
  __typename: 'ProposalCommentsPayload';
  comments: Array<ProposalComment>;
  hasMore: Scalars['Boolean']['output'];
  total: Scalars['Int']['output'];
};

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
  userId?: Maybe<Scalars['ID']['output']>;
};

export type PublishProposalInput = {
  categories: Array<ProposalCategory>;
  center: CoordinateInput;
  description?: InputMaybe<Scalars['String']['input']>;
  elements: Array<Scalars['JSON']['input']>;
  fabricId: Scalars['ID']['input'];
  mapStyle: MapStyle;
  thumbnail: Scalars['String']['input'];
  title: Scalars['String']['input'];
  zoom: Scalars['Float']['input'];
};

export type PublishProposalResult = ForbiddenError | NotFoundError | Proposal | UnauthorizedError;

export type Query = {
  __typename: 'Query';
  exploreProposals: ExploreProposalsPayload;
  fabric: FabricResult;
  geocodeLocation: Array<GeocodeResult>;
  me?: Maybe<User>;
  myDashboardStats: MyDashboardStatsResult;
  myFabrics: MyFabricsResult;
  myProposalLikes: MyProposalLikesResult;
  myProposals: MyProposalsResult;
  nearestRoadName?: Maybe<Scalars['String']['output']>;
  proposal: ProposalResult;
  proposalByFabricId?: Maybe<Proposal>;
  proposalBySlug: ProposalBySlugResult;
  proposalCommentReplies: Array<ProposalComment>;
  proposalComments: ProposalCommentsPayload;
  reverseGeocodeLocation: Scalars['String']['output'];
  routeBetween: Array<Coordinate>;
  user: UserResult;
};


export type QueryExploreProposalsArgs = {
  categories?: InputMaybe<Array<ProposalCategory>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nearLat?: InputMaybe<Scalars['Float']['input']>;
  nearLng?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  radiusMiles?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<ExploreSortBy>;
};


export type QueryFabricArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGeocodeLocationArgs = {
  focusLat?: InputMaybe<Scalars['Float']['input']>;
  focusLng?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
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


export type QueryNearestRoadNameArgs = {
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
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


export type QueryProposalCommentRepliesArgs = {
  parentId: Scalars['ID']['input'];
};


export type QueryProposalCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  proposalSlug: Scalars['String']['input'];
  sortBy?: InputMaybe<CommentSortBy>;
};


export type QueryReverseGeocodeLocationArgs = {
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
};


export type QueryRouteBetweenArgs = {
  a: CoordinateInput;
  b: CoordinateInput;
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};

export type RecordProposalViewInput = {
  proposalId: Scalars['ID']['input'];
};

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
  mapStyle: MapStyle;
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

export type ToggleProposalCommentLikeInput = {
  commentId: Scalars['ID']['input'];
};

export type ToggleProposalCommentLikeResult = NotFoundError | ProposalComment | UnauthorizedError;

export type ToggleProposalLikeInput = {
  proposalId: Scalars['ID']['input'];
};

export type ToggleProposalLikeResult = NotFoundError | Proposal | UnauthorizedError;

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

export type UpdateFabricMapStyleInput = {
  id: Scalars['ID']['input'];
  mapStyle: MapStyle;
};

export type UpdateFabricMapStyleResult = Fabric | ForbiddenError | NotFoundError | UnauthorizedError;

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

export type UpdateProposalCommentInput = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type UpdateProposalCommentResult = ForbiddenError | NotFoundError | ProposalComment | UnauthorizedError;

export type User = {
  __typename: 'User';
  authProviders: Array<AuthProvider>;
  bannerImageUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  hasPassword: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  likedProposals?: Maybe<Array<Proposal>>;
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  numLikes: Scalars['Int']['output'];
  numProposals: Scalars['Int']['output'];
  numViews: Scalars['Int']['output'];
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  proposals: Array<Proposal>;
  role: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserResult = NotFoundError | User;

export type ValidationError = {
  __typename: 'ValidationError';
  errors: Array<FieldError>;
};

export type GoogleLoginMutationVariables = Exact<{
  input: GoogleLoginInput;
}>;


export type GoogleLoginMutation = { __typename: 'Mutation', googleLogin:
    | { __typename: 'ConflictError', message: string }
    | { __typename: 'GoogleLoginResponse', isNewUser: boolean, user: { __typename: 'User', id: string, name: string, role: string, hasPassword: boolean, email: string, authProviders: Array<AuthProvider>, username: string, profilePictureUrl?: string | null } }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename: 'Mutation', login:
    | { __typename: 'ConflictError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
    | { __typename: 'User', id: string, name: string, role: string, hasPassword: boolean, email: string, authProviders: Array<AuthProvider>, username: string, profilePictureUrl?: string | null }
   };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename: 'Mutation', register:
    | { __typename: 'ConflictError', message: string }
    | { __typename: 'User', id: string, name: string, role: string, hasPassword: boolean, email: string, authProviders: Array<AuthProvider>, username: string, profilePictureUrl?: string | null }
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

export type DeleteFabricMutationVariables = Exact<{
  input: DeleteFabricInput;
}>;


export type DeleteFabricMutation = { __typename: 'Mutation', deleteFabric:
    | { __typename: 'ConflictError', message: string }
    | { __typename: 'Fabric', id: string }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type CreateFabricThumbnailUploadUrlMutationVariables = Exact<{
  input: CreateFabricThumbnailUploadUrlInput;
}>;


export type CreateFabricThumbnailUploadUrlMutation = { __typename: 'Mutation', createFabricThumbnailUploadUrl:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'PresignedUploadResult', uploadUrl: string, publicUrl: string }
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

export type CreateUserBannerUploadUrlMutationVariables = Exact<{
  input: CreateUserBannerUploadUrlInput;
}>;


export type CreateUserBannerUploadUrlMutation = { __typename: 'Mutation', createUserBannerUploadUrl:
    | { __typename: 'PresignedUploadResult', publicUrl: string, uploadUrl: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type CreateUserProfilePictureUploadUrlMutationVariables = Exact<{
  input: CreateUserProfilePictureUploadUrlInput;
}>;


export type CreateUserProfilePictureUploadUrlMutation = { __typename: 'Mutation', createUserProfilePictureUploadUrl:
    | { __typename: 'PresignedUploadResult', publicUrl: string, uploadUrl: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename: 'Mutation', editProfile:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
    | { __typename: 'User', id: string, bannerImageUrl?: string | null, profilePictureUrl?: string | null, bio?: string | null, location?: string | null, name: string, createdAt: string, username: string, numProposals: number, numLikes: number, numViews: number, proposals: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }>, likedProposals?: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }> | null }
   };

export type ProposalCommentsQueryVariables = Exact<{
  sortBy?: InputMaybe<CommentSortBy>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  proposalSlug: Scalars['String']['input'];
}>;


export type ProposalCommentsQuery = { __typename: 'Query', proposalComments: { __typename: 'ProposalCommentsPayload', total: number, hasMore: boolean, comments: Array<{ __typename: 'ProposalComment', id: string, editedAt?: string | null, deletedAt?: string | null, isLikedByMe: boolean, likeCount: number, replyCount: number, createdAt: string, body: string, parent?: { __typename: 'ProposalComment', id: string } | null, location?: { __typename: 'CommentLocation', name: string, lat: number, lng: number } | null, user: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }> } };

export type CommentCardFragment = { __typename: 'ProposalComment', id: string, editedAt?: string | null, deletedAt?: string | null, isLikedByMe: boolean, likeCount: number, replyCount: number, createdAt: string, body: string, parent?: { __typename: 'ProposalComment', id: string } | null, location?: { __typename: 'CommentLocation', name: string, lat: number, lng: number } | null, user: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } };

export type CreateProposalCommentMutationVariables = Exact<{
  input: CreateProposalCommentInput;
}>;


export type CreateProposalCommentMutation = { __typename: 'Mutation', createProposalComment:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'ProposalComment', id: string, editedAt?: string | null, deletedAt?: string | null, isLikedByMe: boolean, likeCount: number, replyCount: number, createdAt: string, body: string, parent?: { __typename: 'ProposalComment', id: string } | null, location?: { __typename: 'CommentLocation', name: string, lat: number, lng: number } | null, user: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type ReverseGeocodeLocationQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
}>;


export type ReverseGeocodeLocationQuery = { __typename: 'Query', reverseGeocodeLocation: string };

export type DeleteProposalCommentMutationVariables = Exact<{
  input: DeleteProposalCommentInput;
}>;


export type DeleteProposalCommentMutation = { __typename: 'Mutation', deleteProposalComment:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'ProposalComment', id: string, deletedAt?: string | null, replyCount: number }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type ProposalCommentRepliesQueryVariables = Exact<{
  parentId: Scalars['ID']['input'];
}>;


export type ProposalCommentRepliesQuery = { __typename: 'Query', proposalCommentReplies: Array<{ __typename: 'ProposalComment', id: string, editedAt?: string | null, deletedAt?: string | null, isLikedByMe: boolean, likeCount: number, replyCount: number, createdAt: string, body: string, replyToComment?: { __typename: 'ProposalComment', id: string, user: { __typename: 'User', id: string, name: string } } | null, parent?: { __typename: 'ProposalComment', id: string } | null, location?: { __typename: 'CommentLocation', name: string, lat: number, lng: number } | null, user: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }> };

export type ReplyCardFragment = { __typename: 'ProposalComment', id: string, editedAt?: string | null, deletedAt?: string | null, isLikedByMe: boolean, likeCount: number, replyCount: number, createdAt: string, body: string, replyToComment?: { __typename: 'ProposalComment', id: string, user: { __typename: 'User', id: string, name: string } } | null, parent?: { __typename: 'ProposalComment', id: string } | null, location?: { __typename: 'CommentLocation', name: string, lat: number, lng: number } | null, user: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } };

export type ToggleProposalCommentLikeMutationVariables = Exact<{
  input: ToggleProposalCommentLikeInput;
}>;


export type ToggleProposalCommentLikeMutation = { __typename: 'Mutation', toggleProposalCommentLike:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'ProposalComment', id: string, likeCount: number, isLikedByMe: boolean }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type UpdateProposalCommentMutationVariables = Exact<{
  input: UpdateProposalCommentInput;
}>;


export type UpdateProposalCommentMutation = { __typename: 'Mutation', updateProposalComment:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'ProposalComment', id: string, editedAt?: string | null, deletedAt?: string | null, isLikedByMe: boolean, likeCount: number, replyCount: number, createdAt: string, body: string, replyToComment?: { __typename: 'ProposalComment', id: string, user: { __typename: 'User', id: string, name: string } } | null, parent?: { __typename: 'ProposalComment', id: string } | null, location?: { __typename: 'CommentLocation', name: string, lat: number, lng: number } | null, user: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type CreateProposalThumbnailUploadUrlMutationVariables = Exact<{
  input: CreateProposalThumbnailUploadUrlInput;
}>;


export type CreateProposalThumbnailUploadUrlMutation = { __typename: 'Mutation', createProposalThumbnailUploadUrl:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'PresignedUploadResult', uploadUrl: string, publicUrl: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type DeleteProposalMutationVariables = Exact<{
  input: DeleteProposalInput;
}>;


export type DeleteProposalMutation = { __typename: 'Mutation', deleteProposal:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, fabricId: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type CreateFabricMutationVariables = Exact<{
  input: CreateFabricInput;
}>;


export type CreateFabricMutation = { __typename: 'Mutation', createFabric:
    | { __typename: 'Fabric', id: string, zoom: number, elements: any, locationCity: string, locationRegion: string, locationRegionAbbr?: string | null, thumbnail?: string | null, title: string, updatedAt: string, center: { __typename: 'Coordinate', lat: number, lng: number }, proposal?: { __typename: 'Proposal', id: string, isPublished: boolean } | null }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me?: { __typename: 'User', id: string, name: string, role: string, hasPassword: boolean, email: string, authProviders: Array<AuthProvider>, username: string, profilePictureUrl?: string | null } | null };

export type MeFragment = { __typename: 'User', id: string, name: string, role: string, hasPassword: boolean, email: string, authProviders: Array<AuthProvider>, username: string, profilePictureUrl?: string | null };

export type NearestRoadNameQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
}>;


export type NearestRoadNameQuery = { __typename: 'Query', nearestRoadName?: string | null };

export type RouteBetweenQueryVariables = Exact<{
  a: CoordinateInput;
  b: CoordinateInput;
}>;


export type RouteBetweenQuery = { __typename: 'Query', routeBetween: Array<{ __typename: 'Coordinate', lng: number, lat: number }> };

export type ExploreProposalsQueryVariables = Exact<{
  categories?: InputMaybe<Array<ProposalCategory> | ProposalCategory>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<ExploreSortBy>;
  nearLat?: InputMaybe<Scalars['Float']['input']>;
  nearLng?: InputMaybe<Scalars['Float']['input']>;
  radiusMiles?: InputMaybe<Scalars['Float']['input']>;
}>;


export type ExploreProposalsQuery = { __typename: 'Query', exploreProposals: { __typename: 'ExploreProposalsPayload', hasMore: boolean, total: number, proposals: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }> } };

export type ProposalCardFragment = { __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } };

export type GeocodeLocationQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  focusLng?: InputMaybe<Scalars['Float']['input']>;
  focusLat?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GeocodeLocationQuery = { __typename: 'Query', geocodeLocation: Array<{ __typename: 'GeocodeResult', lat: number, lng: number, displayName: string }> };

export type MyDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyDashboardStatsQuery = { __typename: 'Query', myDashboardStats:
    | { __typename: 'DashboardStats', fabricCount: number, proposalCount: number, proposalLikesDelta: number, proposalViewsDelta: number, proposalCommentsDelta: number, totalProposalLikes: number, totalProposalViews: number, totalProposalComments: number, unpublishedProposalCount: number }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type MyFabricsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MyFabricsQuery = { __typename: 'Query', myFabrics:
    | { __typename: 'MyFabricsPayload', total: number, hasMore: boolean, fabrics: Array<{ __typename: 'Fabric', id: string, zoom: number, elements: any, locationCity: string, locationRegion: string, locationRegionAbbr?: string | null, thumbnail?: string | null, title: string, updatedAt: string, center: { __typename: 'Coordinate', lat: number, lng: number }, proposal?: { __typename: 'Proposal', id: string, isPublished: boolean } | null }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type FabricCardFragment = { __typename: 'Fabric', id: string, zoom: number, elements: any, locationCity: string, locationRegion: string, locationRegionAbbr?: string | null, thumbnail?: string | null, title: string, updatedAt: string, center: { __typename: 'Coordinate', lat: number, lng: number }, proposal?: { __typename: 'Proposal', id: string, isPublished: boolean } | null };

export type MyProposalsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProposalStatusFilter>;
  categories?: InputMaybe<Array<ProposalCategory> | ProposalCategory>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MyProposalsQuery = { __typename: 'Query', myProposals:
    | { __typename: 'MyProposalsPayload', total: number, hasMore: boolean, proposals: Array<{ __typename: 'Proposal', id: string, fabricId: string, title: string, updatedAt: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isPublished: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotThumbnail: string }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type ProposalRowFragment = { __typename: 'Proposal', id: string, fabricId: string, title: string, updatedAt: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isPublished: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotThumbnail: string };

export type RecentFabricsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentFabricsQuery = { __typename: 'Query', myFabrics:
    | { __typename: 'MyFabricsPayload', total: number, fabrics: Array<{ __typename: 'Fabric', id: string, zoom: number, elements: any, locationCity: string, locationRegion: string, locationRegionAbbr?: string | null, thumbnail?: string | null, title: string, updatedAt: string, center: { __typename: 'Coordinate', lat: number, lng: number }, proposal?: { __typename: 'Proposal', id: string, isPublished: boolean } | null }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type RecentProposalsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentProposalsQuery = { __typename: 'Query', myProposals:
    | { __typename: 'MyProposalsPayload', total: number, proposals: Array<{ __typename: 'Proposal', id: string, fabricId: string, title: string, slug: string, isPublished: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotThumbnail: string, updatedAt: string, likeCount: number, viewCount: number, commentCount: number }> }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename: 'Mutation', deleteAccount:
    | { __typename: 'DeleteAccountResponse', data: boolean }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type EditEmailMutationVariables = Exact<{
  input: EditEmailInput;
}>;


export type EditEmailMutation = { __typename: 'Mutation', editEmail:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
    | { __typename: 'User', email: string, id: string }
    | { __typename: 'ValidationError', errors: Array<{ __typename: 'FieldError', message: string, field: string }> }
   };

export type EditPasswordMutationVariables = Exact<{
  input: EditPasswordInput;
}>;


export type EditPasswordMutation = { __typename: 'Mutation', editPassword:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
    | { __typename: 'User', id: string, hasPassword: boolean }
   };

export type GetFabricQueryVariables = Exact<{
  fabricId: Scalars['ID']['input'];
}>;


export type GetFabricQuery = { __typename: 'Query', fabric:
    | { __typename: 'Fabric', id: string, title: string, zoom: number, elements: any, thumbnail?: string | null, mapStyle: MapStyle, locationCity: string, locationRegion: string, locationRegionAbbr?: string | null, creator: { __typename: 'User', id: string }, center: { __typename: 'Coordinate', lng: number, lat: number }, proposal?: { __typename: 'Proposal', id: string, slug: string } | null }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type ProposalByFabricIdQueryVariables = Exact<{
  fabricId: Scalars['ID']['input'];
}>;


export type ProposalByFabricIdQuery = { __typename: 'Query', proposalByFabricId?: { __typename: 'Proposal', id: string, slug: string } | null };

export type ProposalFormResultFragment = { __typename: 'Proposal', id: string, fabricId: string, slug: string, isPublished: boolean, title: string, description?: string | null, categories: Array<ProposalCategory>, snapshotElements: any, snapshotZoom: number, snapshotMapStyle: MapStyle, snapshotThumbnail: string, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotCenter: { __typename: 'Coordinate', lat: number, lng: number } };

export type PublishProposalMutationVariables = Exact<{
  input: PublishProposalInput;
}>;


export type PublishProposalMutation = { __typename: 'Mutation', publishProposal:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, fabricId: string, slug: string, isPublished: boolean, title: string, description?: string | null, categories: Array<ProposalCategory>, snapshotElements: any, snapshotZoom: number, snapshotMapStyle: MapStyle, snapshotThumbnail: string, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotCenter: { __typename: 'Coordinate', lat: number, lng: number } }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type SaveDraftProposalMutationVariables = Exact<{
  input: SaveDraftProposalInput;
}>;


export type SaveDraftProposalMutation = { __typename: 'Mutation', saveDraftProposal:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, fabricId: string, slug: string, isPublished: boolean, title: string, description?: string | null, categories: Array<ProposalCategory>, snapshotElements: any, snapshotZoom: number, snapshotMapStyle: MapStyle, snapshotThumbnail: string, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotCenter: { __typename: 'Coordinate', lat: number, lng: number } }
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

export type UpdateFabricMapStyleMutationVariables = Exact<{
  input: UpdateFabricMapStyleInput;
}>;


export type UpdateFabricMapStyleMutation = { __typename: 'Mutation', updateFabricMapStyle:
    | { __typename: 'Fabric', id: string, mapStyle: MapStyle }
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type GetProposalForEditQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetProposalForEditQuery = { __typename: 'Query', proposalBySlug:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, fabricId: string, isPublished: boolean, title: string, description?: string | null, categories: Array<ProposalCategory> }
   };

export type GetProposalQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetProposalQuery = { __typename: 'Query', proposalBySlug:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, fabricId: string, isLikedByMe: boolean, description?: string | null, publishedAt?: string | null, slug: string, commentCount: number, categories: Array<ProposalCategory>, likeCount: number, snapshotElements: any, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotMapStyle: MapStyle, snapshotThumbnail: string, snapshotZoom: number, title: string, viewCount: number, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null }, snapshotCenter: { __typename: 'Coordinate', lat: number, lng: number } }
   };

export type ToggleProposalLikeMutationVariables = Exact<{
  input: ToggleProposalLikeInput;
}>;


export type ToggleProposalLikeMutation = { __typename: 'Mutation', toggleProposalLike:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', id: string, likeCount: number, isLikedByMe: boolean }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type UnpublishProposalMutationVariables = Exact<{
  input: UnpublishProposalInput;
}>;


export type UnpublishProposalMutation = { __typename: 'Mutation', unpublishProposal:
    | { __typename: 'ForbiddenError', message: string }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'Proposal', isPublished: boolean, id: string, publishedAt?: string | null }
    | { __typename: 'UnauthorizedError', message: string }
   };

export type RecordProposalViewMutationVariables = Exact<{
  input: RecordProposalViewInput;
}>;


export type RecordProposalViewMutation = { __typename: 'Mutation', recordProposalView?: { __typename: 'Proposal', id: string, viewCount: number } | null };

export type GetUserProfileQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserProfileQuery = { __typename: 'Query', user:
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'User', id: string, bannerImageUrl?: string | null, profilePictureUrl?: string | null, bio?: string | null, location?: string | null, name: string, createdAt: string, username: string, numProposals: number, numLikes: number, numViews: number, proposals: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }>, likedProposals?: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }> | null }
   };

export type UserProfileFragment = { __typename: 'User', id: string, bannerImageUrl?: string | null, profilePictureUrl?: string | null, bio?: string | null, location?: string | null, name: string, createdAt: string, username: string, numProposals: number, numLikes: number, numViews: number, proposals: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }>, likedProposals?: Array<{ __typename: 'Proposal', id: string, title: string, viewCount: number, commentCount: number, slug: string, likeCount: number, isLikedByMe: boolean, snapshotLocationCity: string, snapshotLocationRegion: string, snapshotLocationRegionAbbr?: string | null, snapshotThumbnail: string, publishedAt?: string | null, categories: Array<ProposalCategory>, creator: { __typename: 'User', id: string, name: string, username: string, profilePictureUrl?: string | null } }> | null };

export const CommentCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<CommentCardFragment, unknown>;
export const ReplyCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReplyCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentCard"}},{"kind":"Field","name":{"kind":"Name","value":"replyToComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<ReplyCardFragment, unknown>;
export const MeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Me"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authProviders"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]} as unknown as DocumentNode<MeFragment, unknown>;
export const FabricCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FabricCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<FabricCardFragment, unknown>;
export const ProposalRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}}]}}]} as unknown as DocumentNode<ProposalRowFragment, unknown>;
export const ProposalFormResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFormResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotElements"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotCenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"snapshotZoom"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotMapStyle"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}}]}}]} as unknown as DocumentNode<ProposalFormResultFragment, unknown>;
export const ProposalCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}}]} as unknown as DocumentNode<ProposalCardFragment, unknown>;
export const UserProfileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"numProposals"}},{"kind":"Field","name":{"kind":"Name","value":"numLikes"}},{"kind":"Field","name":{"kind":"Name","value":"numViews"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"likedProposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}}]} as unknown as DocumentNode<UserProfileFragment, unknown>;
export const GoogleLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GoogleLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GoogleLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoogleLoginResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Me"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isNewUser"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Me"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authProviders"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]} as unknown as DocumentNode<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Me"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Me"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authProviders"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Me"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Me"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authProviders"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateFabricTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricTitleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricTitleMutation, UpdateFabricTitleMutationVariables>;
export const DeleteFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteFabricInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConflictError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteFabricMutation, DeleteFabricMutationVariables>;
export const CreateFabricThumbnailUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFabricThumbnailUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFabricThumbnailUploadUrlInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFabricThumbnailUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PresignedUploadResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"publicUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFabricThumbnailUploadUrlMutation, CreateFabricThumbnailUploadUrlMutationVariables>;
export const UpdateFabricThumbnailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricThumbnail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricThumbnailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricThumbnail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricThumbnailMutation, UpdateFabricThumbnailMutationVariables>;
export const SyncViewportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncViewport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncViewportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncViewport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SyncViewportMutation, SyncViewportMutationVariables>;
export const CreateUserBannerUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserBannerUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserBannerUploadUrlInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserBannerUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PresignedUploadResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicUrl"}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserBannerUploadUrlMutation, CreateUserBannerUploadUrlMutationVariables>;
export const CreateUserProfilePictureUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserProfilePictureUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserProfilePictureUploadUrlInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserProfilePictureUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PresignedUploadResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicUrl"}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserProfilePictureUploadUrlMutation, CreateUserProfilePictureUploadUrlMutationVariables>;
export const EditProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserProfile"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"numProposals"}},{"kind":"Field","name":{"kind":"Name","value":"numLikes"}},{"kind":"Field","name":{"kind":"Name","value":"numViews"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"likedProposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}}]}}]} as unknown as DocumentNode<EditProfileMutation, EditProfileMutationVariables>;
export const ProposalCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProposalComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentSortBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposalComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"proposalSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentCard"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<ProposalCommentsQuery, ProposalCommentsQueryVariables>;
export const CreateProposalCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProposalComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProposalCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProposalComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentCard"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<CreateProposalCommentMutation, CreateProposalCommentMutationVariables>;
export const ReverseGeocodeLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReverseGeocodeLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lng"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reverseGeocodeLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"lng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lng"}}}]}]}}]} as unknown as DocumentNode<ReverseGeocodeLocationQuery, ReverseGeocodeLocationQueryVariables>;
export const DeleteProposalCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProposalComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteProposalCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProposalComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteProposalCommentMutation, DeleteProposalCommentMutationVariables>;
export const ProposalCommentRepliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProposalCommentReplies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposalCommentReplies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReplyCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReplyCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentCard"}},{"kind":"Field","name":{"kind":"Name","value":"replyToComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProposalCommentRepliesQuery, ProposalCommentRepliesQueryVariables>;
export const ToggleProposalCommentLikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleProposalCommentLike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToggleProposalCommentLikeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleProposalCommentLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}}]}}]}}]}}]} as unknown as DocumentNode<ToggleProposalCommentLikeMutation, ToggleProposalCommentLikeMutationVariables>;
export const UpdateProposalCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProposalComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProposalCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProposalComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReplyCard"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReplyCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentCard"}},{"kind":"Field","name":{"kind":"Name","value":"replyToComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProposalCommentMutation, UpdateProposalCommentMutationVariables>;
export const CreateProposalThumbnailUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProposalThumbnailUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProposalThumbnailUploadUrlInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProposalThumbnailUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PresignedUploadResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"publicUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CreateProposalThumbnailUploadUrlMutation, CreateProposalThumbnailUploadUrlMutationVariables>;
export const DeleteProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteProposalMutation, DeleteProposalMutationVariables>;
export const CreateFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFabricInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FabricCard"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FabricCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateFabricMutation, CreateFabricMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Me"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Me"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authProviders"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const NearestRoadNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NearestRoadName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lng"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nearestRoadName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"lng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lng"}}}]}]}}]} as unknown as DocumentNode<NearestRoadNameQuery, NearestRoadNameQueryVariables>;
export const RouteBetweenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RouteBetween"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"a"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinateInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"b"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"routeBetween"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"a"},"value":{"kind":"Variable","name":{"kind":"Name","value":"a"}}},{"kind":"Argument","name":{"kind":"Name","value":"b"},"value":{"kind":"Variable","name":{"kind":"Name","value":"b"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}}]}}]}}]} as unknown as DocumentNode<RouteBetweenQuery, RouteBetweenQueryVariables>;
export const ExploreProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExploreProposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categories"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalCategory"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExploreSortBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nearLat"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nearLng"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"radiusMiles"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exploreProposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categories"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"nearLat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nearLat"}}},{"kind":"Argument","name":{"kind":"Name","value":"nearLng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nearLng"}}},{"kind":"Argument","name":{"kind":"Name","value":"radiusMiles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"radiusMiles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}}]} as unknown as DocumentNode<ExploreProposalsQuery, ExploreProposalsQueryVariables>;
export const GeocodeLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GeocodeLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focusLng"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focusLat"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geocodeLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"focusLng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focusLng"}}},{"kind":"Argument","name":{"kind":"Name","value":"focusLat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focusLat"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GeocodeLocationQuery, GeocodeLocationQueryVariables>;
export const MyDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DashboardStats"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabricCount"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"proposalLikesDelta"}},{"kind":"Field","name":{"kind":"Name","value":"proposalViewsDelta"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCommentsDelta"}},{"kind":"Field","name":{"kind":"Name","value":"totalProposalLikes"}},{"kind":"Field","name":{"kind":"Name","value":"totalProposalViews"}},{"kind":"Field","name":{"kind":"Name","value":"totalProposalComments"}},{"kind":"Field","name":{"kind":"Name","value":"unpublishedProposalCount"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<MyDashboardStatsQuery, MyDashboardStatsQueryVariables>;
export const MyFabricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyFabrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFabrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyFabricsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"fabrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FabricCard"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FabricCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<MyFabricsQuery, MyFabricsQueryVariables>;
export const MyProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalStatusFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categories"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalCategory"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"categories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categories"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyProposalsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalRow"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}}]}}]} as unknown as DocumentNode<MyProposalsQuery, MyProposalsQueryVariables>;
export const RecentFabricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentFabrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFabrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyFabricsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FabricCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FabricCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RecentFabricsQuery, RecentFabricsQueryVariables>;
export const RecentProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentProposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MyProposalsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RecentProposalsQuery, RecentProposalsQueryVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteAccountResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const EditEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EditEmailMutation, EditEmailMutationVariables>;
export const EditPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}}]}}]}}]}}]} as unknown as DocumentNode<EditPasswordMutation, EditPasswordMutationVariables>;
export const GetFabricDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFabric"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fabric"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"center"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zoom"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"mapStyle"}},{"kind":"Field","name":{"kind":"Name","value":"locationCity"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"locationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GetFabricQuery, GetFabricQueryVariables>;
export const ProposalByFabricIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProposalByFabricId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposalByFabricId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fabricId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fabricId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<ProposalByFabricIdQuery, ProposalByFabricIdQueryVariables>;
export const PublishProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublishProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalFormResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFormResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotElements"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotCenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"snapshotZoom"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotMapStyle"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}}]}}]} as unknown as DocumentNode<PublishProposalMutation, PublishProposalMutationVariables>;
export const SaveDraftProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveDraftProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveDraftProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveDraftProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalFormResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFormResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotElements"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotCenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"snapshotZoom"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotMapStyle"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}}]}}]} as unknown as DocumentNode<SaveDraftProposalMutation, SaveDraftProposalMutationVariables>;
export const UpdateFabricElementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricElements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricElementsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricElements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"elements"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricElementsMutation, UpdateFabricElementsMutationVariables>;
export const UpdateFabricMapStyleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFabricMapStyle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFabricMapStyleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFabricMapStyle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fabric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mapStyle"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFabricMapStyleMutation, UpdateFabricMapStyleMutationVariables>;
export const GetProposalForEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalForEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposalBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}}]}}]}}]} as unknown as DocumentNode<GetProposalForEditQuery, GetProposalForEditQueryVariables>;
export const GetProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposalBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fabricId"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotCenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"snapshotElements"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotMapStyle"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotZoom"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetProposalQuery, GetProposalQueryVariables>;
export const ToggleProposalLikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleProposalLike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToggleProposalLikeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleProposalLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}}]}}]}}]}}]} as unknown as DocumentNode<ToggleProposalLikeMutation, ToggleProposalLikeMutationVariables>;
export const UnpublishProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnpublishProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnpublishProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unpublishProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnauthorizedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UnpublishProposalMutation, UnpublishProposalMutationVariables>;
export const RecordProposalViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecordProposalView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecordProposalViewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordProposalView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}}]}}]}}]} as unknown as DocumentNode<RecordProposalViewMutation, RecordProposalViewMutationVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserProfile"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"likeCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLikedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationCity"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotLocationRegionAbbr"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotThumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"numProposals"}},{"kind":"Field","name":{"kind":"Name","value":"numLikes"}},{"kind":"Field","name":{"kind":"Name","value":"numViews"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"likedProposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalCard"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
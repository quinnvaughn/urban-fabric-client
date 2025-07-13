import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  DateTime: { input: any; output: any; }
  GeoJSON: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ApplicationError = {
  message: Scalars['String']['output'];
};

export type BikeLaneFeature = Feature & {
  __typename?: 'BikeLaneFeature';
  buffer: Scalars['String']['output'];
  connectsTo: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  curbSide: Scalars['Boolean']['output'];
  geometry: Scalars['GeoJSON']['output'];
  gradeSeparated: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  oneWay: Scalars['Boolean']['output'];
  option: FeatureOption;
  parkingAdjacent: Scalars['Boolean']['output'];
  scenario: Scenario;
  updatedAt: Scalars['DateTime']['output'];
  width: Scalars['Float']['output'];
};

export type Canvas = {
  __typename?: 'Canvas';
  author: User;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  published: Scalars['Boolean']['output'];
  scenarios: Array<Scenario>;
  slug?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Category = {
  __typename?: 'Category';
  featureOptions: Array<FeatureOption>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
};

export type ConflictError = ApplicationError & {
  __typename?: 'ConflictError';
  message: Scalars['String']['output'];
};

export type CreateCanvasInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateScenarioInput = {
  canvasId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Feature = {
  createdAt: Scalars['DateTime']['output'];
  geometry: Scalars['GeoJSON']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FeatureOption = {
  __typename?: 'FeatureOption';
  description?: Maybe<Scalars['String']['output']>;
  geometryType: GeometryType;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  propertiesSchema: Scalars['JSON']['output'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ForbiddenError = ApplicationError & {
  __typename?: 'ForbiddenError';
  message: Scalars['String']['output'];
};

export enum GeometryType {
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  MultiPoint = 'MultiPoint',
  MultiPolygon = 'MultiPolygon',
  Point = 'Point',
  Polygon = 'Polygon'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCanvas: MutationCreateCanvasResult;
  createScenario: MutationCreateScenarioResult;
  login: MutationLoginResult;
  logout: Scalars['Boolean']['output'];
  register: MutationRegisterResult;
  renameScenario: MutationRenameScenarioResult;
  upsertFeature: MutationUpsertFeatureResult;
};


export type MutationCreateCanvasArgs = {
  input: CreateCanvasInput;
};


export type MutationCreateScenarioArgs = {
  input: CreateScenarioInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRenameScenarioArgs = {
  input: RenameScenarioInput;
};


export type MutationUpsertFeatureArgs = {
  input: UpsertFeatureInput;
};

export type MutationCreateCanvasResult = Canvas | UnauthorizedError;

export type MutationCreateScenarioResult = Scenario | UnauthorizedError;

export type MutationLoginResult = ForbiddenError | UnauthorizedError | User;

export type MutationRegisterResult = ForbiddenError | User | ValidationError;

export type MutationRenameScenarioResult = ForbiddenError | NotFoundError | Scenario | UnauthorizedError | ValidationError;

export type MutationUpsertFeatureResult = ForbiddenError | MutationUpsertFeatureSuccess | NotFoundError | UnauthorizedError;

export type MutationUpsertFeatureSuccess = {
  __typename?: 'MutationUpsertFeatureSuccess';
  data: Feature;
};

export type NotFoundError = ApplicationError & {
  __typename?: 'NotFoundError';
  message: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  canvas: QueryCanvasResult;
  categories: Array<Category>;
  category: QueryCategoryResult;
  currentUser?: Maybe<User>;
  featureOption: QueryFeatureOptionResult;
  featureOptions: Array<FeatureOption>;
  user: QueryUserResult;
};


export type QueryCanvasArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFeatureOptionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCanvasResult = Canvas | ForbiddenError | NotFoundError | UnauthorizedError;

export type QueryCategoryResult = Category | NotFoundError;

export type QueryFeatureOptionResult = FeatureOption | NotFoundError;

export type QueryUserResult = NotFoundError | User;

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type RenameScenarioInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Scenario = {
  __typename?: 'Scenario';
  canvas: Canvas;
  createdAt: Scalars['DateTime']['output'];
  features: Array<Feature>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UnauthorizedError = ApplicationError & {
  __typename?: 'UnauthorizedError';
  message: Scalars['String']['output'];
};

export type UpsertFeatureInput = {
  geometry: Scalars['GeoJSON']['input'];
  optionId: Scalars['ID']['input'];
  properties: Scalars['JSON']['input'];
  scenarioId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  canvases: Array<Canvas>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type ValidationError = ApplicationError & {
  __typename?: 'ValidationError';
  errors?: Maybe<Array<FieldError>>;
  message: Scalars['String']['output'];
};

export type UserCanvasesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCanvasesQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, canvases: Array<{ __typename?: 'Canvas', id: string, name: string }> } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, email: string, name?: string | null } | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename: 'ForbiddenError', message: string } | { __typename: 'UnauthorizedError', message: string } | { __typename: 'User', id: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };


export const UserCanvasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCanvases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"canvases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UserCanvasesQuery, UserCanvasesQueryVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
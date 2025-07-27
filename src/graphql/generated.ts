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
  DateTime: { input: string; output: string; }
  GeoJSON: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ApplicationError = {
  message: Scalars['String']['output'];
};

export type BikeLaneLayerInstance = LayerInstance & {
  __typename: 'BikeLaneLayerInstance';
  buffer: Scalars['String']['output'];
  connectsTo: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  curbSide: Scalars['Boolean']['output'];
  geometry: Scalars['GeoJSON']['output'];
  gradeSeparated: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  oneWay: Scalars['Boolean']['output'];
  option: LayerTemplate;
  parkingAdjacent: Scalars['Boolean']['output'];
  scenario: Scenario;
  updatedAt: Scalars['DateTime']['output'];
  width: Scalars['Float']['output'];
};

export type Category = {
  __typename: 'Category';
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  layerTemplates: Array<LayerTemplate>;
  order?: Maybe<Scalars['Int']['output']>;
};

export type CategoryResult = Category | NotFoundError;

export type ConflictError = ApplicationError & {
  __typename: 'ConflictError';
  message: Scalars['String']['output'];
};

export type CreateScenarioInput = {
  simulationId: Scalars['ID']['input'];
};

export type CreateScenarioResult = ForbiddenError | NotFoundError | Scenario | UnauthorizedError | ValidationError;

export type CreateSimulationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateSimulationResult = ForbiddenError | NotFoundError | Simulation | UnauthorizedError;

export type DeleteSimulationInput = {
  id: Scalars['ID']['input'];
};

export type DeleteSimulationResponse = {
  __typename: 'DeleteSimulationResponse';
  data: Scalars['Boolean']['output'];
};

export type DeleteSimulationResult = DeleteSimulationResponse | ForbiddenError | NotFoundError | UnauthorizedError;

export type FieldError = {
  __typename: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ForbiddenError = ApplicationError & {
  __typename: 'ForbiddenError';
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

export type LayerInstance = {
  createdAt: Scalars['DateTime']['output'];
  geometry: Scalars['GeoJSON']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LayerTemplate = {
  __typename: 'LayerTemplate';
  description?: Maybe<Scalars['String']['output']>;
  geometryType: GeometryType;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interactionConfig: Scalars['JSON']['output'];
  label: Scalars['String']['output'];
  propertiesSchema: Scalars['JSON']['output'];
};

export type LayerTemplateResult = LayerTemplate | NotFoundError;

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResult = ForbiddenError | UnauthorizedError | User;

export type Mutation = {
  __typename: 'Mutation';
  createScenario: CreateScenarioResult;
  createSimulation: CreateSimulationResult;
  deleteSimulation: DeleteSimulationResult;
  login: LoginResult;
  logout: Scalars['Boolean']['output'];
  register: RegisterResult;
  renameScenario: RenameScenarioResult;
  updateLastOpenedAt: UpdateLastOpenedAtResult;
  updateLastViewedScenario: UpdateLastViewedScenarioResult;
  updateSimulation: UpdateSimulationResult;
  upsertLayerInstance: UpsertLayerInstanceResult;
};


export type MutationCreateScenarioArgs = {
  input: CreateScenarioInput;
};


export type MutationCreateSimulationArgs = {
  input: CreateSimulationInput;
};


export type MutationDeleteSimulationArgs = {
  input: DeleteSimulationInput;
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


export type MutationUpdateLastOpenedAtArgs = {
  input: UpdateLastOpenedAtInput;
};


export type MutationUpdateLastViewedScenarioArgs = {
  input: UpdateLastViewedScenarioInput;
};


export type MutationUpdateSimulationArgs = {
  input: UpdateSimulationInput;
};


export type MutationUpsertLayerInstanceArgs = {
  input: UpsertLayerInstanceInput;
};

export type NotFoundError = ApplicationError & {
  __typename: 'NotFoundError';
  message: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  categories: Array<Category>;
  category: CategoryResult;
  currentUser?: Maybe<User>;
  layerTemplate: LayerTemplateResult;
  layerTemplates: Array<LayerTemplate>;
  simulation: SimulationResult;
  user: UserResult;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLayerTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySimulationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterResult = ForbiddenError | User | ValidationError;

export type RenameScenarioInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type RenameScenarioResult = ForbiddenError | NotFoundError | Scenario | UnauthorizedError | ValidationError;

export type Scenario = {
  __typename: 'Scenario';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  layerInstances: Array<LayerInstance>;
  name: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  simulation: Simulation;
  updatedAt: Scalars['DateTime']['output'];
};

export type Simulation = {
  __typename: 'Simulation';
  author: User;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  scenarios: Array<Scenario>;
  state: SimulationState;
  updatedAt: Scalars['DateTime']['output'];
};

export type SimulationResult = ForbiddenError | NotFoundError | Simulation | UnauthorizedError;

export type SimulationState = {
  __typename: 'SimulationState';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastOpenedAt: Scalars['DateTime']['output'];
  lastViewedScenarioId: Scalars['ID']['output'];
  simulation: Simulation;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type UnauthorizedError = ApplicationError & {
  __typename: 'UnauthorizedError';
  message: Scalars['String']['output'];
};

export type UpdateLastOpenedAtInput = {
  simulationId: Scalars['ID']['input'];
};

export type UpdateLastOpenedAtResult = ForbiddenError | NotFoundError | SimulationState | UnauthorizedError;

export type UpdateLastViewedScenarioInput = {
  scenarioId: Scalars['ID']['input'];
  simulationId: Scalars['ID']['input'];
};

export type UpdateLastViewedScenarioResult = ForbiddenError | NotFoundError | SimulationState | UnauthorizedError;

export type UpdateSimulationInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSimulationResult = ForbiddenError | NotFoundError | Simulation | UnauthorizedError | ValidationError;

export type UpsertLayerInstanceInput = {
  geometry: Scalars['GeoJSON']['input'];
  properties: Scalars['JSON']['input'];
  scenarioId: Scalars['ID']['input'];
  templateId: Scalars['ID']['input'];
};

export type UpsertLayerInstanceResponse = {
  __typename: 'UpsertLayerInstanceResponse';
  data: LayerInstance;
};

export type UpsertLayerInstanceResult = ForbiddenError | NotFoundError | UnauthorizedError | UpsertLayerInstanceResponse;

export type User = {
  __typename: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  simulations: Array<Simulation>;
};

export type UserResult = NotFoundError | User;

export type ValidationError = ApplicationError & {
  __typename: 'ValidationError';
  errors?: Maybe<Array<FieldError>>;
  message: Scalars['String']['output'];
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename: 'Query', categories: Array<{ __typename: 'Category', id: string, icon?: string | null, order?: number | null, label: string, layerTemplates: Array<{ __typename: 'LayerTemplate', id: string, label: string, propertiesSchema: any, geometryType: GeometryType, description?: string | null, icon?: string | null }> }> };

export type AllCategoriesFragment = { __typename: 'Category', id: string, icon?: string | null, order?: number | null, label: string, layerTemplates: Array<{ __typename: 'LayerTemplate', id: string, label: string, propertiesSchema: any, geometryType: GeometryType, description?: string | null, icon?: string | null }> };

export type SelectedTemplateFragment = { __typename: 'LayerTemplate', id: string, label: string, propertiesSchema: any, geometryType: GeometryType, description?: string | null, icon?: string | null };

export type CreateScenarioMutationVariables = Exact<{
  input: CreateScenarioInput;
}>;


export type CreateScenarioMutation = { __typename: 'Mutation', createScenario: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'Scenario', id: string, name: string } | { __typename: 'UnauthorizedError', message: string } | { __typename: 'ValidationError', message: string, errors?: Array<{ __typename: 'FieldError', field: string, message: string }> | null } };

export type RenameScenarioMutationVariables = Exact<{
  input: RenameScenarioInput;
}>;


export type RenameScenarioMutation = { __typename: 'Mutation', renameScenario: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'Scenario', id: string, name: string } | { __typename: 'UnauthorizedError', message: string } | { __typename: 'ValidationError', message: string, errors?: Array<{ __typename: 'FieldError', field: string, message: string }> | null } };

export type UpdateLastViewedScenarioMutationVariables = Exact<{
  input: UpdateLastViewedScenarioInput;
}>;


export type UpdateLastViewedScenarioMutation = { __typename: 'Mutation', updateLastViewedScenario: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'SimulationState', id: string, lastViewedScenarioId: string, lastOpenedAt: string } | { __typename: 'UnauthorizedError', message: string } };

export type CreateSimulationMutationVariables = Exact<{
  input: CreateSimulationInput;
}>;


export type CreateSimulationMutation = { __typename: 'Mutation', createSimulation: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'Simulation', id: string } | { __typename: 'UnauthorizedError', message: string } };

export type DeleteSimulationMutationVariables = Exact<{
  input: DeleteSimulationInput;
}>;


export type DeleteSimulationMutation = { __typename: 'Mutation', deleteSimulation: { __typename: 'DeleteSimulationResponse', data: boolean } | { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'UnauthorizedError', message: string } };

export type GetSimulationQueryVariables = Exact<{
  simulationId: Scalars['ID']['input'];
}>;


export type GetSimulationQuery = { __typename: 'Query', simulation: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'Simulation', id: string, name: string, state: { __typename: 'SimulationState', id: string, lastViewedScenarioId: string, lastOpenedAt: string }, scenarios: Array<{ __typename: 'Scenario', id: string, name: string }> } | { __typename: 'UnauthorizedError', message: string } };

export type SimulationInfoFragment = { __typename: 'Simulation', id: string, name: string, state: { __typename: 'SimulationState', id: string, lastViewedScenarioId: string, lastOpenedAt: string }, scenarios: Array<{ __typename: 'Scenario', id: string, name: string }> };

export type SimulationScenarioFragment = { __typename: 'Scenario', id: string, name: string };

export type UpdateLastOpenedAtMutationVariables = Exact<{
  input: UpdateLastOpenedAtInput;
}>;


export type UpdateLastOpenedAtMutation = { __typename: 'Mutation', updateLastOpenedAt: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'SimulationState', id: string, lastViewedScenarioId: string, lastOpenedAt: string } | { __typename: 'UnauthorizedError', message: string } };

export type UpdateSimulationMutationVariables = Exact<{
  input: UpdateSimulationInput;
}>;


export type UpdateSimulationMutation = { __typename: 'Mutation', updateSimulation: { __typename: 'ForbiddenError', message: string } | { __typename: 'NotFoundError', message: string } | { __typename: 'Simulation', id: string, name: string } | { __typename: 'UnauthorizedError', message: string } | { __typename: 'ValidationError', message: string, errors?: Array<{ __typename: 'FieldError', field: string, message: string }> | null } };

export type UserSimulationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserSimulationsQuery = { __typename: 'Query', currentUser?: { __typename: 'User', id: string, simulations: Array<{ __typename: 'Simulation', id: string, name: string, updatedAt: string, state: { __typename: 'SimulationState', id: string, lastViewedScenarioId: string, lastOpenedAt: string } }> } | null };

export type SimulationStateInfoFragment = { __typename: 'SimulationState', id: string, lastViewedScenarioId: string, lastOpenedAt: string };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename: 'Query', currentUser?: { __typename: 'User', id: string, email: string, name?: string | null } | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename: 'Mutation', login: { __typename: 'ForbiddenError', message: string } | { __typename: 'UnauthorizedError', message: string } | { __typename: 'User', id: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename: 'Mutation', register: { __typename: 'ForbiddenError', message: string } | { __typename: 'User', id: string } | { __typename: 'ValidationError', message: string, errors?: Array<{ __typename: 'FieldError', message: string, field: string }> | null } };

export const SelectedTemplateFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectedTemplate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"propertiesSchema"}},{"kind":"Field","name":{"kind":"Name","value":"geometryType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]} as unknown as DocumentNode<SelectedTemplateFragment, unknown>;
export const AllCategoriesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllCategories"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"layerTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectedTemplate"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectedTemplate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"propertiesSchema"}},{"kind":"Field","name":{"kind":"Name","value":"geometryType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]} as unknown as DocumentNode<AllCategoriesFragment, unknown>;
export const SimulationStateInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationStateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedScenarioId"}},{"kind":"Field","name":{"kind":"Name","value":"lastOpenedAt"}}]}}]} as unknown as DocumentNode<SimulationStateInfoFragment, unknown>;
export const SimulationScenarioFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationScenario"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<SimulationScenarioFragment, unknown>;
export const SimulationInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Simulation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationStateInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenarios"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationScenario"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationStateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedScenarioId"}},{"kind":"Field","name":{"kind":"Name","value":"lastOpenedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationScenario"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<SimulationInfoFragment, unknown>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllCategories"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectedTemplate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"propertiesSchema"}},{"kind":"Field","name":{"kind":"Name","value":"geometryType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllCategories"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"layerTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectedTemplate"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const CreateScenarioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateScenario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateScenarioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createScenario"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationScenario"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationScenario"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<CreateScenarioMutation, CreateScenarioMutationVariables>;
export const RenameScenarioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameScenario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameScenarioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameScenario"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationScenario"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationScenario"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<RenameScenarioMutation, RenameScenarioMutationVariables>;
export const UpdateLastViewedScenarioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLastViewedScenario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLastViewedScenarioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLastViewedScenario"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationStateInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationStateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedScenarioId"}},{"kind":"Field","name":{"kind":"Name","value":"lastOpenedAt"}}]}}]} as unknown as DocumentNode<UpdateLastViewedScenarioMutation, UpdateLastViewedScenarioMutationVariables>;
export const CreateSimulationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSimulation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSimulationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSimulation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Simulation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSimulationMutation, CreateSimulationMutationVariables>;
export const DeleteSimulationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSimulation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSimulationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSimulation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSimulationResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSimulationMutation, DeleteSimulationMutationVariables>;
export const GetSimulationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSimulation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"simulationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simulation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"simulationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Simulation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationStateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedScenarioId"}},{"kind":"Field","name":{"kind":"Name","value":"lastOpenedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationScenario"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Scenario"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Simulation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationStateInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenarios"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationScenario"}}]}}]}}]} as unknown as DocumentNode<GetSimulationQuery, GetSimulationQueryVariables>;
export const UpdateLastOpenedAtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLastOpenedAt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLastOpenedAtInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLastOpenedAt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationStateInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationStateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedScenarioId"}},{"kind":"Field","name":{"kind":"Name","value":"lastOpenedAt"}}]}}]} as unknown as DocumentNode<UpdateLastOpenedAtMutation, UpdateLastOpenedAtMutationVariables>;
export const UpdateSimulationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSimulation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSimulationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSimulation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Simulation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSimulationMutation, UpdateSimulationMutationVariables>;
export const UserSimulationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSimulations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simulations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimulationStateInfo"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimulationStateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SimulationState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedScenarioId"}},{"kind":"Field","name":{"kind":"Name","value":"lastOpenedAt"}}]}}]} as unknown as DocumentNode<UserSimulationsQuery, UserSimulationsQueryVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApplicationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForbiddenError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
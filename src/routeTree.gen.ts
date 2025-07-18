/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

import { Route as rootRouteImport } from './routes/__root'
import { Route as PublicRouteImport } from './routes/_public'
import { Route as AuthRouteImport } from './routes/_auth'
import { Route as PublicIndexRouteImport } from './routes/_public/index'
import { Route as PublicRegisterRouteImport } from './routes/_public/register'
import { Route as PublicLoginRouteImport } from './routes/_public/login'
import { Route as AuthProfileRouteImport } from './routes/_auth/profile'
import { Route as AuthDashboardShellRouteImport } from './routes/_auth/dashboard/_shell'
import { Route as AuthDashboardShellIndexRouteImport } from './routes/_auth/dashboard/_shell/index'
import { Route as AuthDashboardSimulationSimulationIdRouteImport } from './routes/_auth/dashboard/simulation/$simulationId'

const AuthDashboardRouteImport = createFileRoute('/_auth/dashboard')()

const PublicRoute = PublicRouteImport.update({
  id: '/_public',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRoute = AuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthDashboardRoute = AuthDashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AuthRoute,
} as any)
const PublicIndexRoute = PublicIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PublicRoute,
} as any)
const PublicRegisterRoute = PublicRegisterRouteImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => PublicRoute,
} as any)
const PublicLoginRoute = PublicLoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => PublicRoute,
} as any)
const AuthProfileRoute = AuthProfileRouteImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthRoute,
} as any)
const AuthDashboardShellRoute = AuthDashboardShellRouteImport.update({
  id: '/_shell',
  getParentRoute: () => AuthDashboardRoute,
} as any)
const AuthDashboardShellIndexRoute = AuthDashboardShellIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthDashboardShellRoute,
} as any)
const AuthDashboardSimulationSimulationIdRoute =
  AuthDashboardSimulationSimulationIdRouteImport.update({
    id: '/simulation/$simulationId',
    path: '/simulation/$simulationId',
    getParentRoute: () => AuthDashboardRoute,
  } as any)

export interface FileRoutesByFullPath {
  '/profile': typeof AuthProfileRoute
  '/login': typeof PublicLoginRoute
  '/register': typeof PublicRegisterRoute
  '/': typeof PublicIndexRoute
  '/dashboard': typeof AuthDashboardShellRouteWithChildren
  '/dashboard/simulation/$simulationId': typeof AuthDashboardSimulationSimulationIdRoute
  '/dashboard/': typeof AuthDashboardShellIndexRoute
}
export interface FileRoutesByTo {
  '/profile': typeof AuthProfileRoute
  '/login': typeof PublicLoginRoute
  '/register': typeof PublicRegisterRoute
  '/': typeof PublicIndexRoute
  '/dashboard': typeof AuthDashboardShellIndexRoute
  '/dashboard/simulation/$simulationId': typeof AuthDashboardSimulationSimulationIdRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/_auth': typeof AuthRouteWithChildren
  '/_public': typeof PublicRouteWithChildren
  '/_auth/profile': typeof AuthProfileRoute
  '/_public/login': typeof PublicLoginRoute
  '/_public/register': typeof PublicRegisterRoute
  '/_public/': typeof PublicIndexRoute
  '/_auth/dashboard': typeof AuthDashboardRouteWithChildren
  '/_auth/dashboard/_shell': typeof AuthDashboardShellRouteWithChildren
  '/_auth/dashboard/simulation/$simulationId': typeof AuthDashboardSimulationSimulationIdRoute
  '/_auth/dashboard/_shell/': typeof AuthDashboardShellIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/profile'
    | '/login'
    | '/register'
    | '/'
    | '/dashboard'
    | '/dashboard/simulation/$simulationId'
    | '/dashboard/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/profile'
    | '/login'
    | '/register'
    | '/'
    | '/dashboard'
    | '/dashboard/simulation/$simulationId'
  id:
    | '__root__'
    | '/_auth'
    | '/_public'
    | '/_auth/profile'
    | '/_public/login'
    | '/_public/register'
    | '/_public/'
    | '/_auth/dashboard'
    | '/_auth/dashboard/_shell'
    | '/_auth/dashboard/simulation/$simulationId'
    | '/_auth/dashboard/_shell/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  AuthRoute: typeof AuthRouteWithChildren
  PublicRoute: typeof PublicRouteWithChildren
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_auth/dashboard': {
      id: '/_auth/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthDashboardRouteImport
      parentRoute: typeof AuthRoute
    }
    '/_public/': {
      id: '/_public/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PublicIndexRouteImport
      parentRoute: typeof PublicRoute
    }
    '/_public/register': {
      id: '/_public/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof PublicRegisterRouteImport
      parentRoute: typeof PublicRoute
    }
    '/_public/login': {
      id: '/_public/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof PublicLoginRouteImport
      parentRoute: typeof PublicRoute
    }
    '/_auth/profile': {
      id: '/_auth/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthProfileRouteImport
      parentRoute: typeof AuthRoute
    }
    '/_auth/dashboard/_shell': {
      id: '/_auth/dashboard/_shell'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthDashboardShellRouteImport
      parentRoute: typeof AuthDashboardRoute
    }
    '/_auth/dashboard/_shell/': {
      id: '/_auth/dashboard/_shell/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof AuthDashboardShellIndexRouteImport
      parentRoute: typeof AuthDashboardShellRoute
    }
    '/_auth/dashboard/simulation/$simulationId': {
      id: '/_auth/dashboard/simulation/$simulationId'
      path: '/simulation/$simulationId'
      fullPath: '/dashboard/simulation/$simulationId'
      preLoaderRoute: typeof AuthDashboardSimulationSimulationIdRouteImport
      parentRoute: typeof AuthDashboardRoute
    }
  }
}

interface AuthDashboardShellRouteChildren {
  AuthDashboardShellIndexRoute: typeof AuthDashboardShellIndexRoute
}

const AuthDashboardShellRouteChildren: AuthDashboardShellRouteChildren = {
  AuthDashboardShellIndexRoute: AuthDashboardShellIndexRoute,
}

const AuthDashboardShellRouteWithChildren =
  AuthDashboardShellRoute._addFileChildren(AuthDashboardShellRouteChildren)

interface AuthDashboardRouteChildren {
  AuthDashboardShellRoute: typeof AuthDashboardShellRouteWithChildren
  AuthDashboardSimulationSimulationIdRoute: typeof AuthDashboardSimulationSimulationIdRoute
}

const AuthDashboardRouteChildren: AuthDashboardRouteChildren = {
  AuthDashboardShellRoute: AuthDashboardShellRouteWithChildren,
  AuthDashboardSimulationSimulationIdRoute:
    AuthDashboardSimulationSimulationIdRoute,
}

const AuthDashboardRouteWithChildren = AuthDashboardRoute._addFileChildren(
  AuthDashboardRouteChildren,
)

interface AuthRouteChildren {
  AuthProfileRoute: typeof AuthProfileRoute
  AuthDashboardRoute: typeof AuthDashboardRouteWithChildren
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthProfileRoute: AuthProfileRoute,
  AuthDashboardRoute: AuthDashboardRouteWithChildren,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

interface PublicRouteChildren {
  PublicLoginRoute: typeof PublicLoginRoute
  PublicRegisterRoute: typeof PublicRegisterRoute
  PublicIndexRoute: typeof PublicIndexRoute
}

const PublicRouteChildren: PublicRouteChildren = {
  PublicLoginRoute: PublicLoginRoute,
  PublicRegisterRoute: PublicRegisterRoute,
  PublicIndexRoute: PublicIndexRoute,
}

const PublicRouteWithChildren =
  PublicRoute._addFileChildren(PublicRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  AuthRoute: AuthRouteWithChildren,
  PublicRoute: PublicRouteWithChildren,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

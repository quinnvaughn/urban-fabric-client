import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fabric/$id/publish')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/fabric/$id/publish"!</div>
}

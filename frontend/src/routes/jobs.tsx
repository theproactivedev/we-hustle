import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/jobs')({
  component: JobPage,
})

function JobPage() {
  return <div>Hello "/jobs"!</div>
}

import { QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { queryClient } from '../lib/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Header from '../components/Header'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />

      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

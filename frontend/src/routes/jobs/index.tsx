import { createFileRoute, useNavigate } from "@tanstack/react-router";
import JobsPage from "../../features/jobs";
import type { JobSearch } from "../../features/jobs/types";
import { validateJobSearch } from "../../features/jobs/utils";

export const Route = createFileRoute("/jobs/")({
  validateSearch: validateJobSearch,
  component: JobsRoutePage,
});

function JobsRoutePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleSearchChange = (nextSearch: JobSearch) => {
    void navigate({ search: () => nextSearch });
  };

  return <JobsPage search={search} onSearchChange={handleSearchChange} />;
}

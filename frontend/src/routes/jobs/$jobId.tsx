import { createFileRoute } from "@tanstack/react-router";
import JobSinglePage from "../../features/jobs/JobSinglePage";

export const Route = createFileRoute("/jobs/$jobId")({
  component: JobSingleRoute,
});

function JobSingleRoute() {
  const { jobId } = Route.useParams();

  return <JobSinglePage jobId={jobId} />;
}

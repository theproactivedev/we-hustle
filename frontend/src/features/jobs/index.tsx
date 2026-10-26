import { useState } from "react";
import type { SubmitEvent } from "react";
import Footer from "../../components/Footer";
import JobRow from "../home/JobRow";
import { useCurrentUser } from "../auth/queries";
import { getApplicationErrorMessage, useSubmitApplication } from "../applications/mutations";
import { useMyApplications } from "../applications/queries";
import { getSavedJobErrorMessage, useToggleSavedJob } from "../savedJobs/mutations";
import { useMySavedJobs } from "../savedJobs/queries";
import SignInOrRegisterModal from "../signInOrRegisterModal";
import { useJobs } from "./queries";
import { getJobSearchFromForm, jobTypes } from "./utils";
import type { JobsPageProps } from "./types";
import type { AuthModalState } from "../signInOrRegisterModal/types";

const chamfer = "[clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]";

export default function JobsPage({ search, onSearchChange }: JobsPageProps) {
  const { data, error, isLoading } = useJobs(search);
  const [authModalState, setAuthModalState] = useState<AuthModalState>(null);
  const [applicationJobId, setApplicationJobId] = useState<string | null>(null);
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const applicationsQuery = useMyApplications(user?.id);
  const appliedJobIds = new Set(applicationsQuery.data?.data.jobIds ?? []);
  const applicationMutation = useSubmitApplication();
  const savedJobsQuery = useMySavedJobs(user?.id);
  const savedJobIds = new Set(savedJobsQuery.data?.data.jobIds ?? []);
  const savedJobMutation = useToggleSavedJob(user?.id);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchChange(getJobSearchFromForm(new FormData(event.currentTarget)));
  };

  const handleApply = (jobId: string) => {
    if (appliedJobIds.has(jobId)) {
      return;
    }

    applicationMutation.reset();
    setApplicationJobId(null);

    if (user?.id) {
      setApplicationJobId(jobId);
      applicationMutation.mutate(jobId);
    } else if (!isAuthLoading) {
      setAuthModalState({ jobId, intent: "apply" });
    }
  };

  const handleSave = (jobId: string) => {
    if (user?.id) {
      savedJobMutation.mutate({ jobId, isSaved: savedJobIds.has(jobId) });
    } else if (!isAuthLoading) {
      setAuthModalState({ jobId, intent: "save" });
    }
  };

  const clearFilters = () => onSearchChange({});

  return (
    <>
      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="inline-flex items-center gap-2 border border-teal-400/30 bg-teal-400/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-teal-400">
              <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-teal-400 shadow-[0_0_10px_var(--color-teal-400)]" />
              WE HUSTLE / OPEN ROLES
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Browse all jobs
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">
              Find a role by title, company, location, job type, or minimum hourly rate.
            </p>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
          aria-labelledby="jobs-heading"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="jobs-heading" className="font-display text-2xl font-semibold sm:text-3xl">
              Open roles
            </h2>
            <p className="font-mono text-sm text-mute" role="status" aria-live="polite">
              {isLoading
                ? "Loading jobs..."
                : error
                  ? "Unable to load jobs"
                  : `${data?.data.length ?? 0} roles`}
            </p>
          </div>

          <form
            key={JSON.stringify(search)}
            onSubmit={handleSubmit}
            className="mt-6 grid gap-3 border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end"
          >
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-mute">Search</span>
              <input
                type="search"
                name="q"
                defaultValue={search.q ?? ""}
                placeholder="Title, company, or location"
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-mute">Job Type</span>
              <select name="jobType" defaultValue={search.jobType ?? ""} className="field">
                <option value="">All job types</option>
                {jobTypes.map((jobType) => (
                  <option key={jobType} value={jobType}>
                    {jobType}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-mute">
                Minimum Hourly Rate
              </span>
              <input
                type="number"
                name="minHourlyRate"
                min="0"
                step="any"
                defaultValue={search.minHourlyRate ?? ""}
                placeholder="e.g. 60"
                className="field"
              />
            </label>
            <div className="flex gap-3 sm:col-span-2 lg:col-span-1">
              <button type="submit" className="cursor-pointer btn btn-primary flex-1 lg:flex-none">
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer btn btn-ghost flex-1 lg:flex-none"
              >
                Clear
              </button>
            </div>
          </form>

          <div className={`mt-6 bg-line p-px ${chamfer}`}>
            {isLoading ? (
              <p className="bg-panel px-6 py-14 text-center font-mono text-sm text-mute">
                Loading jobs...
              </p>
            ) : error ? (
              <p className="bg-panel px-6 py-14 text-center text-sm text-mute" role="alert">
                Jobs could not be loaded. Please try again.
              </p>
            ) : data?.data.length ? (
              <div className={`divide-y divide-line bg-panel ${chamfer}`}>
                {data.data.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    saved={savedJobIds.has(job.id)}
                    onSave={handleSave}
                    isSavedLoading={savedJobsQuery.isLoading}
                    isSavePending={savedJobMutation.isPending && savedJobMutation.variables?.jobId === job.id}
                    saveError={
                      savedJobMutation.isError && savedJobMutation.variables?.jobId === job.id
                        ? getSavedJobErrorMessage(savedJobMutation.error)
                        : undefined
                    }
                    onApply={handleApply}
                    isAuthLoading={isAuthLoading}
                    isApplicationsLoading={applicationsQuery.isLoading}
                    isApplied={appliedJobIds.has(job.id)}
                    isApplying={applicationJobId === job.id && applicationMutation.isPending}
                    applicationMessage={
                      applicationJobId === job.id && applicationMutation.isSuccess
                        ? "Your application was submitted."
                        : undefined
                    }
                    applicationError={
                      applicationJobId === job.id && applicationMutation.isError
                        ? getApplicationErrorMessage(applicationMutation.error)
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="bg-panel px-6 py-14 text-center">
                <p className="font-display  text-lg font-semibold">No roles match those filters</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-mute">
                  Try a broader search or clear your filters to see all available jobs.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      {authModalState && (
        <SignInOrRegisterModal
          jobId={authModalState.jobId}
          intent={authModalState.intent}
          onClose={() => setAuthModalState(null)}
        />
      )}
      <Footer />
    </>
  );
}

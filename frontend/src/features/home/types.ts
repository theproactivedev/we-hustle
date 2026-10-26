import type { Job } from "../../dataTypes";

type JobRowProps = {
  job: Job;
  saved?: boolean;
  onSave?: (jobId: string) => void;
  isSavedLoading?: boolean;
  isSavePending?: boolean;
  saveError?: string;
  onApply?: (jobId: string) => void;
  isAuthLoading?: boolean;
  isApplicationsLoading?: boolean;
  isApplied?: boolean;
  isApplying?: boolean;
  applicationMessage?: string;
  applicationError?: string;
};

export type {
    JobRowProps
}
type SavedJobsResponse = {
  message: string;
  data: {
    jobIds: string[];
  };
};

type SavedJobResponse = {
  message: string;
  data: {
    id: string;
    jobId: string;
    userId: string;
  };
};

type DeleteSavedJobResponse = {
  message: string;
};

export type { DeleteSavedJobResponse, SavedJobResponse, SavedJobsResponse };

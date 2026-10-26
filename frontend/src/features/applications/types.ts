type ApplicationResponse = {
  message: string;
  data: {
    id: string;
    status: string;
    appliedAt: string;
    jobId: string;
    applicantId: string;
  };
};

type MyApplicationsResponse = {
  message: string;
  data: {
    jobIds: string[];
  };
};

export type { ApplicationResponse, MyApplicationsResponse };

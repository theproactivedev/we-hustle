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

export type { ApplicationResponse };

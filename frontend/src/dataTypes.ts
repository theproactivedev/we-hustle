export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    jobType: string;
    description: string;
    salary: string | null;
    postedAt: Date;
    postedBy?: User;
    postedById: string;
    applications?: Application[];
}

export interface User {
    id: string;
    emailAddress: string;
    password: string;
    name: string;
    userType: string;
    postedJobs: Job[];
    applications: Application[];
}

export interface Application {
    id: string;
    status: string;
    appliedAt: Date;
    job: Job;
    jobId: string;
    applicant: User;
    applicantId: string;
}
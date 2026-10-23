type RegisterPayload = {
  name: string;
  emailAddress: string;
  password: string;
};

type RegisterResponse = {
  message: string;
  data: {
    user: {
      id: string;
      emailAddress: string;
      name: string;
    };
    token: string;
  };
};

export type { RegisterPayload, RegisterResponse };
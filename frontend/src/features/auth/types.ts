type AuthUser = {
  id: string;
  name: string;
  emailAddress: string;
}

type SignInPayload = {
  emailAddress: string;
  password: string;
}

type SignInResponse = {
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export type {
  AuthUser,
  SignInPayload,
  SignInResponse,
}
import axios from "axios";

function getRegisterErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "We couldn't create your account. Please try again.";
  }
  return "We couldn't create your account. Please try again.";
}

function getRegisterValidationError(fields: {
  name: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}): string {
  const name = fields.name.trim();
  const emailAddress = fields.emailAddress.trim();

  if (!name || !emailAddress || !fields.password || !fields.confirmPassword) {
    return "Please complete all fields.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
    return "Enter a valid email address.";
  }
  if (fields.password.length < 8 || fields.confirmPassword.length < 8) {
    return "Your password and confirmation must each be at least 8 characters.";
  }
  if (fields.password !== fields.confirmPassword) {
    return "Those passwords don't match. Check them and try again.";
  }
  return "";
}

export { getRegisterErrorMessage, getRegisterValidationError };

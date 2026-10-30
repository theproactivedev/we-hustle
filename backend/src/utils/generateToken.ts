import jwt, { type SignOptions } from "jsonwebtoken";

const generateToken = (userId: string) => {
  const payload = { id: userId };
  const expiresIn = (process.env.JWT_EXPIRES_IN || "1h") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn },
  );
};

export {
  generateToken,
};

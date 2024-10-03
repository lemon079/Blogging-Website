import jwt from "jsonwebtoken";
const secret_key = process.env.SECRET_KEY;

function createToken(user) {
  return jwt.sign({ user }, secret_key, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secret_key);
  } catch {
    return null;
  }
}

export { createToken, verifyToken };

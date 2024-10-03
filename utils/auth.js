import jwt from "jsonwebtoken";
const secret_key = "2$s*fq124$k9@das2@";

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

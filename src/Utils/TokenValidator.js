import jwt from "jsonwebtoken";
const VerifyToken = async function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

export { VerifyToken };

import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    const accessToken = token.split(" ")[1];
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);

      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      //console.error(err);
      res.status(401).json({ message: "Invalid access token" });
    }
  } else {
    res.status(401).json({ message: "You're not authenticated" });
  }
}

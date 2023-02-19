export function authAdmin(req, res, next) {
  const { role } = req.accessTokenPayload;
  if (role) {
    if (role === 2) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
}

export function authEmployee(req, res, next) {
  const { role } = req.accessTokenPayload;
  if (role) {
    if (role === 3) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
}

export function authCutomer(req, res, next) {
  const { role } = req.accessTokenPayload;
  if (role) {
    if (role === 1) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
}

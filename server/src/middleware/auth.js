const crypto = require("crypto");

const requireAdmin = (req, res, next) => {
  // Se consulta al procesar cada petición, luego de que dotenv haya cargado .env.
  // SECRET_KEY se conserva como alternativa para instalaciones anteriores.
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SECRET_KEY;
  if (!secret) {
    return res.status(503).json({ error: "Falta configurar ADMIN_SESSION_SECRET" });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ error: "Sesión inválida" });
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.exp || session.exp < Date.now()) throw new Error("expired");
    req.admin = session;
    next();
  } catch {
    return res.status(401).json({ error: "Sesión vencida" });
  }
};

module.exports = { requireAdmin };

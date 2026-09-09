const { User } = require("../db");
const crypto = require("crypto");

const createUserController = async (username, password) => {
  try {
    // Intentar crear directamente
    const newUser = await User.create({ username, password });
    return newUser;
  } catch (err) {
    // Capturar error de duplicado (username único)
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new Error("El usuario ya existe");
    }
    throw err; // otros errores
  }
};



const getUserController = async () => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username"] // no devolver password
    });
    return users;
  } catch (err) {
    throw new Error("Error al obtener los usuarios");
  }
};




const loginUserController = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error("Usuario no encontrado");

  if (user.password !== password) throw new Error("Credenciales inválidas");

  // SECRET_KEY se acepta para no invalidar configuraciones existentes.
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SECRET_KEY;
  if (!secret) throw new Error("Falta configurar ADMIN_SESSION_SECRET");
  const payload = Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return { user, token: `${payload}.${signature}` };
};


module.exports = { createUserController, loginUserController, getUserController };

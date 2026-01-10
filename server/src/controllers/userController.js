const { User } = require("../db");

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

  return user;
};


module.exports = { createUserController, loginUserController, getUserController };

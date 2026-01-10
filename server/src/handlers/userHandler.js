// handlers/userHandlers.js
const { createUserController, loginUserController, getUserController } = require("../controllers/userController");


// Crear usuario (solo una vez)
const createUserHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await createUserController(username, password);

    res.status(201).json({ message: "Usuario creado", user: newUser.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserHandler = async (req, res) => {
  try {

    const newUser = await getUserController();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login usuario
const loginUserHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await loginUserController(username, password);

    res.json({ message: "Login exitoso", user: user.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUserHandler, loginUserHandler, getUserHandler };

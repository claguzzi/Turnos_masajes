const app = require("./src/app");
const { sequelize } = require("./src/db");

const PORT = 3001;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () => {
      console.log(`✅ Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al sincronizar la base de datos:", error);
  });

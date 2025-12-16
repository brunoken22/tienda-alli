import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_URL!, {
  dialect: "postgres",
});

export async function initDatabase() {
  try {
    console.log("Conexión a la base de datos establecida");

    // Sincronizar modelos (en desarrollo)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("En modo development");
      // Usar { force: true } para recrear tablas
    }

    return sequelize;
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
}

initDatabase();

export default sequelize;

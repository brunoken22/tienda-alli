import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 255],
      },
    },
    recoverPassword: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    recoverPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "admin",
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "admins",
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ["password", "recoverPassword", "recoverPasswordExpires"],
      },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ["password"],
        },
      },
      withRecover: {
        attributes: {
          include: ["recoverPassword", "recoverPasswordExpires", "id", "password"],
        },
      },
    },
    // Hook para hashear la contraseña antes de guardar
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.dataValues.password) {
          const bcrypt = await import("bcrypt");
          const salt = await bcrypt.genSalt(10);
          admin.dataValues.password = await bcrypt.hash(admin.dataValues.password, salt);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.previous("password") && admin.dataValues.password) {
          const bcrypt = await import("bcrypt");
          const salt = await bcrypt.genSalt(10);
          admin.dataValues.password = await bcrypt.hash(admin.dataValues.password, salt);
        }
      },
    },
  }
);

export default Admin;

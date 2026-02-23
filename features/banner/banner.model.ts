import sequelize from "@/config/sequelize";
import { DataTypes } from "sequelize";

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Banner;

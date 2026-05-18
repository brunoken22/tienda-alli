import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import Product from "../product/product.model";

const Variant = sequelize.define(
  "Variant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    priceOffer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    size: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    colorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    colorHex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "variants",
    timestamps: true,
  },
);

Variant.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default Variant;

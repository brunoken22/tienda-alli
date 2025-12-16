// models/ProductCategory.model.ts
import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";

const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "product_categories", // Nombre explícito
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["productId", "categoryId"], // Evita duplicados
      },
    ],
  }
);

export default ProductCategory;

import sequelize from "@/config/sequelize";
import { DataTypes } from "sequelize";
import Variant from "../variant/variant.model";
import Product from "../product/product.model";

const InventoryMovement = sequelize.define(
  "InventoryMovement",
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

    variantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("SALE", "RETURN", "PURCHASE", "DAMAGED", "ADJUSTMENT"),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    previousStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    newStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

InventoryMovement.belongsTo(Variant, {
  foreignKey: "variantId",
  as: "variant",
});

Variant.hasMany(InventoryMovement, {
  foreignKey: "variantId",
  as: "inventoryMovements",
  onDelete: "CASCADE",
});
InventoryMovement.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
});

Product.hasMany(InventoryMovement, {
  foreignKey: "productId",
  as: "inventoryMovements",
  onDelete: "CASCADE",
});
export default InventoryMovement;

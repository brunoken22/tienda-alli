import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { VariantType } from "@/types/product";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    priceOffer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    imagesId: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sizes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    variant: {
      type: DataTypes.JSONB,
      defaultValue: [],
      validate: {
        isValidVariants(value: VariantType[]) {
          if (!Array.isArray(value)) {
            throw new Error("variant debe ser un array");
          }

          value.forEach((v, index) => {
            // Validar que cada objeto tenga la estructura correcta
            if (!v.id || typeof v.id !== "string") {
              throw new Error(`variant[${index}].id debe ser un string`);
            }
            if (!Array.isArray(v.sizes)) {
              throw new Error(`variant[${index}].sizes debe ser un array`);
            }
            if (!v.color || typeof v.color !== "string") {
              throw new Error(`variant[${index}].color debe ser un string`);
            }
            // if (typeof v.stock !== "number") {
            //   throw new Error(`variant[${index}].stock debe ser un número`);
            // }
            if (typeof v.price !== "number") {
              throw new Error(`variant[${index}].price debe ser un número`);
            }
            if (v.priceOffer && typeof v.priceOffer !== "number") {
              throw new Error(`variant[${index}].priceOffer debe ser un número`);
            }
          });
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;

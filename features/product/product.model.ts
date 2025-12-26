import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { VariantType } from "@/types/product";
import Category from "../category/category.model";
import ProductCategory from "../productCategory/productCategory.model";

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
      get() {
        // Convertir el string a número float cuando se obtiene el valor
        const value = this.getDataValue("price");
        return value ? parseFloat(value) : null;
      },
    },
    priceOffer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      get() {
        // Convertir el string a número float cuando se obtiene el valor
        const value = this.getDataValue("priceOffer");
        return value ? parseFloat(value) : null;
      },
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
            if (!v.colorName || typeof v.colorName !== "string") {
              throw new Error(`variant[${index}].color debe ser un string`);
            }
            if (!v.colorHex || typeof v.colorHex !== "string") {
              throw new Error(`variant[${index}].colorHex debe ser un string`);
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

Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "productId", // FK en tabla intermedia
  otherKey: "categoryId", // Otra FK en tabla intermedia
  as: "categories",
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "categoryId",
  otherKey: "productId",
  as: "products",
});

export default Product;

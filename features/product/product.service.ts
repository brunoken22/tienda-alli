import { ProductQueryParams, ProductType, VariantType } from "@/types/product";
import Product from "./product.model";
import { Op, Sequelize } from "sequelize";
import Category from "../category/category.model";
import sequelize from "@/config/sequelize";

export async function getProductsService(filters?: ProductQueryParams) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      onSale,
      isActive = true,
      page = 1,
      limit = 10,
      sortBy = "title",
      sortOrder = "asc",
    } = filters || {};

    const offset = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const whereConditions: any = {};

    // Filtrar por nombre/título
    if (search) {
      whereConditions.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Filtrar por estado activo
    whereConditions.isActive = isActive;

    // Filtrar por precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.price = {};
      if (minPrice !== undefined) {
        whereConditions.price[Op.gte] = minPrice;
      }
      if (maxPrice !== undefined) {
        whereConditions.price[Op.lte] = maxPrice;
      }
    }

    // Filtrar por productos en oferta (priceOffer > 0 y menor que price)
    if (onSale) {
      whereConditions.priceOffer = {
        [Op.gt]: 0,
        [Op.lt]: Sequelize.col("price"),
      };
    }

    // Construir condiciones para categorías si se especifica
    const includeConditions: any[] = [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ];

    if (category) {
      includeConditions[0].where = {
        title: category,
      };
    }

    // Obtener total de productos para paginación
    const total = await Product.count({
      where: whereConditions,
      include: category ? includeConditions : [],
      distinct: true,
    });
    // Obtener productos con paginación
    const products = await Product.findAll({
      where: whereConditions,
      include: includeConditions,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  } catch (e) {
    const error = e as Error;
    console.error("getProductsService ", error);

    throw new Error(error.message);
  }
}

export async function getProductIDService(id: string, options?: object) {
  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
      ...options,
    });
    if (!product || !product.dataValues.id) {
      throw new Error("Este producto no existe");
    }
    return product.dataValues;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createProductService(
  product: Omit<ProductType, "id" | "categories">,
  categories: string[]
) {
  try {
    const productResponse = await Product.create(product);
    if (productResponse.dataValues) {
      const productWithRelations = productResponse as any;
      await productWithRelations.setCategories(categories);
    }

    return productResponse.dataValues;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function editProductService(
  id: string,
  product: Omit<ProductType, "id" | "categories">,
  categories: string[]
) {
  const transaction = await sequelize.transaction();

  try {
    // 1. Actualizar el producto
    const [updatedRows] = await Product.update(product, {
      where: { id },
      transaction,
    });

    if (updatedRows === 0) {
      await transaction.rollback();
      throw new Error("Producto no encontrado o error al actualizar");
    }

    // 2. Buscar el producto actualizado
    const updatedProduct = await Product.findByPk(id, { transaction });

    if (!updatedProduct) {
      await transaction.rollback();
      throw new Error("Producto no encontrado después de actualizar");
    }
    const productWithRelations = updatedProduct as any;

    // 3. Establecer las categorías
    await productWithRelations.setCategories(categories, { transaction });

    // 4. Hacer commit de la transacción
    await transaction.commit();

    // 5. Devolver el producto con sus relaciones
    return await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] }, // Excluir tabla intermedia
        },
      ],
    });
  } catch (e) {
    await transaction.rollback();
    const error = e as Error;
    console.error("Error en editProductService: ", error);
    throw new Error(error.message);
  }
}

export async function deleteProductService(id: string) {
  try {
    const deleteResponse = await Product.destroy({
      where: { id },
    });
    if (deleteResponse === 0) {
      throw new Error("Producto no encontrado");
    }
    return deleteResponse;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getLatestAdditionsProductsService() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const products = await Product.findAll({
      where: {
        updatedAt: {
          [Op.gte]: oneWeekAgo,
        },
      },
      order: [["updatedAt", "DESC"]],
      limit: 10,
    });
    return products;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getOfferProductsService() {
  try {
    const products = await Product.findAll({
      where: {
        priceOffer: {
          [Op.not]: null,
          [Op.gt]: 0,
        },
      },
      order: [["updatedAt", "DESC"]],
      limit: 10,
    });
    return products;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getShoppingCartService(shoppingCartIds: string[]) {
  try {
    const products = await Product.findAll({
      where: {
        id: shoppingCartIds,
      },
      attributes: ["id", "title", "price", "priceOffer", "variant", "images"],
    });
    return products;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getPriceFilterService() {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      attributes: ["id", "price", "priceOffer", "variant"],
      raw: true,
    });

    let allPrices: number[] = [];
    let allPriceOffers: number[] = [];
    products.forEach((product: any) => {
      // Precio base del producto
      if (product.price) allPrices.push(Number(product.price));
      if (product.priceOffer) allPriceOffers.push(Number(product.priceOffer));

      // Precios de variantes
      if (product.variant && Array.isArray(product.variant)) {
        product.variant.forEach((variant: VariantType) => {
          if (variant.price) allPrices.push(Number(variant.price));
          if (variant.priceOffer) allPriceOffers.push(Number(variant.priceOffer));
        });
      }
    });

    // Filtrar valores válidos (mayores a 0)
    const validPrices = allPrices.filter((price) => price > 0);
    const validPriceOffers = allPriceOffers.filter((price) => price > 0);

    return {
      minPrice: validPrices.length > 0 ? Math.min(...validPrices) : 0,
      maxPrice: validPrices.length > 0 ? Math.max(...validPrices) : 0,
      minPriceOffer: validPriceOffers.length > 0 ? Math.min(...validPriceOffers) : 0,
      maxPriceOffer: validPriceOffers.length > 0 ? Math.max(...validPriceOffers) : 0,
    };
  } catch (e) {
    const error = e as Error;
    console.error("getPriceFilterService", e);
    throw new Error(error.message);
  }
}

export async function getMetricsService() {
  try {
    // 1. Obtener total de productos activos
    const totalProductos = await Product.count({
      where: { isActive: true },
    });

    // 2. Obtener total de categorías activas
    const categories = await Category.count({
      where: { active: true },
    });

    // 3. Obtener todos los productos activos para calcular modelos y ofertas
    const products = await Product.findAll({
      where: { isActive: true },
      attributes: ["id", "variant", "price", "priceOffer"],
      raw: true, // Esto devuelve objetos planos en lugar de instancias
    });

    let variants = 0;
    let offer = 0;

    // Calcular modelos y ofertas
    products.forEach((product: any) => {
      // Contar variantes
      if (product.variant && Array.isArray(product.variant)) {
        variants += product.variant.length;

        // Verificar si alguna variante tiene oferta
        const tieneOfertaEnVariantes = product.variant.some(
          (v: VariantType) => v.priceOffer && v.priceOffer > 0 && v.priceOffer < v.price
        );

        // Verificar si el producto principal tiene oferta
        const tieneOfertaPrincipal =
          product.priceOffer && product.priceOffer > 0 && product.price < product.priceOffer;

        if (tieneOfertaEnVariantes || tieneOfertaPrincipal) {
          offer++;
        }
      } else {
        // Si no tiene variantes, verificar solo oferta principal
        if (product.priceOffer && product.priceOffer > 0 && product.priceOffer < product.price) {
          offer++;
        }
      }
    });

    return {
      metrics: {
        products: totalProductos,
        categories,
        variants,
        offer,
      },
    };
  } catch (e) {
    const error = e as Error;
    console.error("getMetricsService error:", e);
    throw new Error(`Error al obtener métricas: ${error.message}`);
  }
}

import { ProductQueryParams, ProductType, VariantType } from "@/types/product";
import Product from "./product.model";
import { Op } from "sequelize";
import Category from "../category/category.model";
import sequelize from "@/config/sequelize";
import Banner from "../banner/banner.model";

export async function getProductsService(filters?: ProductQueryParams) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      onSale,
      isActive,
      page = 1,
      limit = 10,
      sortBy = "title",
      sortOrder = "asc",
    } = filters || {};

    const offset = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const whereConditions: any = {};

    if (search) {
      whereConditions.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    // Construir include para categorías
    const includeConditions: any[] = [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
        required: false,
      },
    ];

    if (category) {
      includeConditions[0].where = {
        title: category,
        isActive: true,
      };
      includeConditions[0].required = true;
    }

    // ============ OBTENER PRODUCTOS ============
    const products = await Product.findAll({
      where: whereConditions,
      include: includeConditions,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      // distinct: true,
    });

    // ============ PROCESAR PRODUCTOS CON VARIANTES JSON ============
    const productsWithAggregates = products.map((product) => {
      const productData = product.toJSON();
      const variants = (productData.variants as VariantType[]) || [];

      if (variants.length === 0) {
        return {
          ...productData,
          minPrice: 0,
          maxPrice: 0,
          totalStock: 0,
          hasOffer: false,
          bestDiscount: 0,
          priceRange: "$0",
        };
      }

      // Calcular precios (usando priceOffer si existe, sino price)
      const prices = variants.map((v) =>
        v.priceOffer && v.priceOffer > 0 ? v.priceOffer : v.price,
      );
      const minPriceValue = Math.min(...prices);
      const maxPriceValue = Math.max(...prices);

      // Calcular stock total
      const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

      // Verificar si hay oferta
      const hasOffer = variants.some((v) => v.priceOffer && v.priceOffer > 0);

      // Calcular mejor descuento
      const bestDiscount = hasOffer
        ? Math.max(
            ...variants.map((v) => {
              if (v.priceOffer && v.priceOffer > 0) {
                return Math.round(((v.price - v.priceOffer) / v.price) * 100);
              }
              return 0;
            }),
          )
        : 0;

      // Formatear rango de precios
      const priceRange =
        minPriceValue === maxPriceValue
          ? `$${minPriceValue.toLocaleString("es-AR")}`
          : `$${minPriceValue.toLocaleString("es-AR")} - $${maxPriceValue.toLocaleString("es-AR")}`;

      return {
        ...productData,
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        totalStock,
        hasOffer,
        bestDiscount,
        priceRange,
      };
    });

    // ============ APLICAR FILTROS DE PRECIO Y OFERTA (post-query) ============
    let filteredProducts = productsWithAggregates;

    // Filtrar por precio mínimo
    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.maxPrice >= minPrice);
    }

    // Filtrar por precio máximo
    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.minPrice <= maxPrice);
    }

    // Filtrar por productos en oferta
    if (onSale) {
      filteredProducts = filteredProducts.filter((p) => p.hasOffer === true);
    }

    // ============ CALCULAR TOTALES ============
    const total = filteredProducts.length;

    // Aplicar paginación después de filtrar
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    // Calcular valor total del inventario
    const totalInventoryValue = filteredProducts.reduce((sum, product) => {
      const variants = (product.variants as VariantType[]) || [];
      const productValue = variants.reduce((acc, variant) => {
        const price =
          variant.priceOffer && variant.priceOffer > 0 ? variant.priceOffer : variant.price;
        return acc + price * (variant.stock || 0);
      }, 0);
      return sum + productValue;
    }, 0);

    return {
      products: paginatedProducts,
      totalPrice: totalInventoryValue,
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

export async function getProductIDService(id: string, options?: object): Promise<ProductType> {
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
  categories: string[],
) {
  try {
    const productCreate = await Product.create(product);
    if (productCreate.dataValues) {
      const productWithRelations = productCreate as any;
      await productWithRelations.setCategories(categories);
    }
    const productResponse = await Product.findByPk(productCreate.dataValues.id, {
      include: [{ model: Category, as: "categories", through: { attributes: [] } }],
    });
    if (!productResponse || !productResponse.dataValues.id) {
      throw new Error("Error al crear el producto");
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
  categories: string[],
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
      attributes: ["id", "title", "price", "priceOffer", "variants", "images"],
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
      attributes: ["id", "price", "priceOffer", "variants"],
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
    const categories = await Category.count();

    // 3. Obtener todos los productos activos para calcular modelos y ofertas
    const products = await Product.findAll({
      attributes: ["id", "variants", "price", "priceOffer"],
      raw: true, // Esto devuelve objetos planos en lugar de instancias
    });

    let variants = 0;
    let offer = 0;
    let banners = 0;

    // Calcular modelos y ofertas
    products.forEach((product: any) => {
      // Contar variantes
      if (product.variant && Array.isArray(product.variant)) {
        variants += product.variant.length;

        // Verificar si alguna variante tiene oferta
        const tieneOfertaEnVariantes = product.variant.some(
          (v: VariantType) => v.priceOffer && v.priceOffer > 0 && v.priceOffer < v.price,
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

    const totalBanners = await Banner.count();
    banners = totalBanners;
    return {
      metrics: {
        products: totalProductos,
        categories,
        variants,
        offer,
        banners,
      },
    };
  } catch (e) {
    const error = e as Error;
    console.error("getMetricsService error:", e);
    throw new Error(`Error al obtener métricas: ${error.message}`);
  }
}

export async function publishedProductService(id: string, published: boolean) {
  try {
    const [productUpdate] = await Product.update(
      {
        isActive: published,
      },
      {
        where: {
          id,
        },
      },
    );
    return { update: productUpdate };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getCategoryProductsService() {
  try {
    const categories = await Category.findAll({
      where: {
        isActive: true,
      },
      attributes: ["id", "title", "updatedAt"],
      order: [["updatedAt", "DESC"]],
      limit: 10,

      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "title", "price", "priceOffer", "images"],

          where: {
            isActive: true,
          },
        },
      ],
    });
    return categories.map((category) => {
      const plainCategory = category.get({ plain: true });
      plainCategory.products = plainCategory.products?.slice(0, 8) || [];
      return plainCategory;
    });
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getProductsSitemapService() {
  try {
    const products = await Product.findAll({
      attributes: ["id"],
      where: {
        isActive: true,
      },
    });
    return products;
  } catch (e) {
    const error = e as Error;
    console.error("getProductsSitemapService ", error);
    throw new Error(error.message);
  }
}

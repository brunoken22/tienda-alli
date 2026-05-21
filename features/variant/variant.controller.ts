import Product from "../product/product.model";
import Variant from "./variant.model";

export async function CreateVariant() {
  try {
    const variantsResponse = await Product.findAll({
      include: [{ model: Variant, as: "variantRecords" }],
      attributes: ["title"],
    });
    return variantsResponse;

    // const products = await Product.findAll({
    //   attributes: ["id", "variants"],
    // });

    // const variantsProductsResponse = products.map(async (product) => {
    //   const variants = product.dataValues.variants;
    //   if (variants.length > 0) {
    //     const variantPromises = variants.map(async (variant: VariantType) => {
    //       console.log("Creando variantes para el producto:", variant);
    //       await Variant.create({
    //         productId: product.dataValues.id,
    //         ...variant,
    //       });
    //     });
    //     return await Promise.all(variantPromises);
    //   }
    // });

    // const variantsProducts = await Promise.all(variantsProductsResponse);

    // return { totalVariants: variantsProducts.length, variantsProducts };
  } catch (e) {
    const error = e as Error;
    console.error(error);
    throw error.message;
  }
}

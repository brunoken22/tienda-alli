import { ProductType } from "@/types/product";
import Product from "./product.model";

export async function getProductsService() {
  const products = await Product.findAll();
  return products;
}

export async function getProductIdService(id: string, option?: object) {
  const product = await Product.findByPk(id, option || {});
  return product?.dataValues;
}

export async function createProductService(product: Omit<ProductType, "id">) {
  try {
    const productResponse = await Product.create(product);
    return productResponse.dataValues;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function editProductService(id: string, product: Omit<ProductType, "id">) {
  try {
    const [productResponse] = await Product.update(product, {
      where: { id },
    });
    if (productResponse === 0) {
      throw new Error("Producto no encontrado");
    }
    return productResponse;
  } catch (e) {
    const error = e as Error;
    console.log("Esto es el error rel service: ", error);

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

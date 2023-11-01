import { getAllProducts, get_Product_By_ID, update_Product } from "../dao/mongo/products.js";

export const getProducts = async (req, res) => {
    const products = await getAllProducts();
    res.json(products);
};

export const getProductsByID = async (pid, res) => {
    const product = await get_Product_By_ID(pid);
    return product;
};

export const updateProduct = async (pid, req, res) => {
    const result = await update_Product(pid, req);
    return result;
};
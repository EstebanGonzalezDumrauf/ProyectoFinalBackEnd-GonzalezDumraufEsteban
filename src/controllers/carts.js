import { getAllCarts, get_Cart_By_ID, get_Products_of_Cart, update_Products_In_Cart } from "../dao/mongo/carts.js";

export const getCarts = async (req, res) => {
    const carts = await getAllCarts();
    res.json(carts);
};

export const getCartByID = async (cid, res) => {
    const cart = await get_Cart_By_ID(cid);
    res.json(products);
};

export const getProductsOfCart = async (cid, res) => {
    const products = await get_Products_of_Cart(cid);
    return products;
};

export const updateProductsInCart = async (cid, req, res) => {
    const cart = await update_Products_In_Cart(cid, req);
    return cart;
}
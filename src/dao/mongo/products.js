import { productModel } from '../../models/product.js';

export const getAllProducts = async () => {
    return await productModel.find();
};

export const get_Product_By_ID = async (pid) => {
    return await productModel.findOne({ _id: pid })
};

export const update_Product = async (filter, DatosAUpdate) => {
    return await productModel.updateOne(filter, DatosAUpdate);
}

export const delete_Product = async (pid) => {
    try {
        const product = await productModel.deleteOne({ _id: pid });
    } catch (error) {
        return false;
    }

    return true;
};
import {
    delete_Product,
    getAllProducts,
    get_Product_By_ID,
    update_Product
} from "../dao/mongo/products.js";
import nodemailer from 'nodemailer';
import config from '../config/config.js';

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

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'gribsserversiag@gmail.com',
        pass: config.passGmail
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const deleteProductPremium = async (pid, email) => {
    const {
        deletedproducts
    } = await delete_Product(pid);

    console.log(pid, email);

    // Enviar correo electrónico a cada usuario eliminado
    const mailOptions = {
        from: 'gribsserversiag@gmail.com',
        to: email,
        subject: 'Ha sido eliminado un producto',
        text: 'Un producto cargado por Ud. ha sido eliminado por el administrador.'
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Correo enviado a ${email}`);
    } catch (error) {
        // console.error(`Error al enviar correo a ${user.email}:`, error);
        // req.logger.error(`${error} - ${new Date().toLocaleDateString()} `);
    }

    return deletedproducts;
};
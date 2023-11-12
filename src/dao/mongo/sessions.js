import {
    userModel
} from '../../models/user.js';
import { createHash } from "../../utils.js";
import { cartModel } from '../../models/cart.js';

export const getAllUser = async () => {
    return await userModel.find();
};

export const add_User = async (newUser) => {
    const arrayCart = [];
    const cart = await cartModel.create({arrayCart});
    console.log(cart);
    newUser.cart = cart._id;
    console.log(newUser);
    const user = await userModel.create(newUser);
    console.log(user);

    //const cart = cartModel.create();
    return user;
};

export const delete_User = async (_id) => {
    try {
        const user = await userModel.deleteOne(_id);
    } catch (error) {
        return false;
    }

    return true;
};

export const delete_Users = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await userModel.deleteMany({
            fecha_ultima_conexion: { $lt: sevenDaysAgo }
        });

        return result.deletedCount; // Devuelve la cantidad de documentos eliminados
    } catch (error) {
        console.error("Error al eliminar usuarios:", error);
        return 0;
    }
};

export const update_User = async (user) => {
    try {
        const result = await userModel.updateOne(
            { _id: user._id }, 
            { $set: { fecha_ultima_conexion: user.fecha_ultima_conexion } } 
        );

        if (result.nModified === 0) {
            console.log("Usuario no encontrado o ningún cambio realizado.");
            return false;
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return false;
    }

    return true;
};

export const get_User = async (username) => {
    return await userModel.findOne({
        email: username
    });
};

export const get_User_By_Id = async (_id) => {
    const user = await userModel.findById(_id);
    return user;
};

export const reset_Pass = async (email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).send({
            status: "error",
            error: "No existe el usuario"
        });
    }
    const passwordHash = createHash(password);
    await userModel.updateOne({
        email
    }, {
        $set: {
            password: passwordHash
        }
    })
};
import {
    userModel
} from '../../models/user.js';
import { createHash } from "../../utils.js";

export const getAllUser = async () => {
    return await userModel.find();
};

export const add_User = async (newUser) => {
    const user = userModel.create(newUser);
    return user;
};

export const get_User = async (username) => {
    return await userModel.findOne({
        email: username
    });
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
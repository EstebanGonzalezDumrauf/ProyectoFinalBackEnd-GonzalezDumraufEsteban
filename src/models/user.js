import mongoose from "mongoose";

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: function () {
            return new mongoose.Types.ObjectId();
        }
    },
    rol: { /////PROBAR CON UN REGISTER
        type: String,
        default: "usuario"
    },
});

export const userModel = mongoose.model(collection, schema)
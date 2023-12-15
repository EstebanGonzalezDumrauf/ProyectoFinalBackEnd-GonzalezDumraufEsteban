import mongoose, { now } from "mongoose";

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    fecha_ultima_conexion: { 
        type: Date, 
        default: Date.now 
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: function () {
            return new mongoose.Types.ObjectId();
        }
    },
    rol: { /////PUEDE SER: usuario - premium - Administrador
        type: String,
        default: "usuario"
    },
    status: { 
        type: String, 
        default: "Empty" 
    },
    documents: {
        type: [
            {
                name: {
                    type: String
                },
                reference: {
                    type: String
                },
            }
        ],
        default: []
    }
});

export const userModel = mongoose.model(collection, schema)
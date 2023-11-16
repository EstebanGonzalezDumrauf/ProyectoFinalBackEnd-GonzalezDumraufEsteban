import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId, //////////VER SI FUNCIONA
    title: String,
    description: String,
    price: Number,
    category: String,
    status: Boolean,
    owner: { 
        type: String, 
        default: "Administrador"
    },
    thumbnail: [String],
    code: {
        type: String,
        unique: true
    },
    stock: Number
});

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema);

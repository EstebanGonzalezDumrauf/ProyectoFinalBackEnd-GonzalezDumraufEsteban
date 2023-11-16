import {
    Router
} from 'express';
import {
    cartModel
} from '../models/cart.js';
import {
    productModel
} from '../models/product.js';
import mongoose from 'mongoose';
import { getProductsOfCart, getCartByID, updateProductsInCart } from '../controllers/carts.js'
import { updateProduct, getProductsByID } from '../controllers/products.js'
import { addTicket } from '../controllers/tickets.js'
import { checkSession, checkAdmin } from "../config/passport.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        let carrito = await cartModel.find();
        res.send({
            result: 'sucess',
            payload: carrito
        });
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    }
})

router.post('/', async (req, res) => {
    try {
        const { arrayCart } = req.body;

        let result = await cartModel.create({arrayCart});

        console.log('Resultado de la creación del carrito:', result);

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }
});



router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cantidad = 1; //req.body;
        const productId = new mongoose.Types.ObjectId(pid);

        // quantity = parseInt(quantity); 

        // if (isNaN(quantity) || quantity <= 0) {
        //     return res.status(400).json({
        //         result: 'error',
        //         message: 'La cantidad proporcionada no es válida'
        //     });
        // }

        // Buscar el carrito por su ID
        const cartExistente = await cartModel.findById(cid);

        // Verifica si el producto ya está en el carrito
        if (cartExistente && Array.isArray(cartExistente.arrayCart)) {
            const productoEnCarrito = cartExistente.arrayCart.find(elto => elto.product.equals(productId)); // Comparar utilizando .equals()

            if (productoEnCarrito) {
                const quantitySumada = productoEnCarrito.quantity + cantidad;
                // Si ya existe, agregar la cantidad proporcionada en el cuerpo
                productoEnCarrito.quantity = quantitySumada;
            } else {
                // Si el producto no está en el carrito, agregarlo con la cantidad proporcionada en el cuerpo
                cartExistente.arrayCart.push({ product: productId, quantity: cantidad });
            }

            // Guardar el carrito actualizado
            await cartExistente.save();

            res.status(200).json({
                result: 'success',
                message: 'Producto agregado al carrito con éxito'
            });
        } else {
            res.status(404).json({
                result: 'error',
                message: 'El carrito no existe o no tiene la propiedad "products" definida correctamente'
            });
        }
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});


router.put('/:cid', checkSession, async (req, res) => {
    try {
        let arrayCart = req.body;
        let {
            cid
        } = req.params;

        req.logger.debug(`Datos recibidos en ${req.body} - ${new Date().toLocaleDateString()} `);

        let result = await cartModel.updateOne({ //RECORDAR QUE ESTE UPDATE NO AGREGA PRODUCTOS A LOS YA EXISTENTES
            _id: cid                               //PISA EL LISTADO DE PRODUCTOS CON UNO NUEVO
        }, arrayCart);

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }

})

router.delete('/:cid', async (req, res) => {

    //ESTO FUNCIONABA Y BORRABA EL CART COMPLETO
    // let {
    //     pid
    // } = req.params;

    // let result = await cartModel.deleteOne({
    //     _id: pid
    // });

    // res.send({
    //     result: 'sucess',
    //     payload: result
    // });

    //AHORA EL DELETE DEBE VACIAR EL CART
    let {
        cid
    } = req.params;

    const result = await cartModel.updateOne(
        { _id: cid },
        { $set: { arrayCart: [] } }
    );

    res.send({
        result: 'sucess',
        payload: result
    });
})

router.delete('/:cid/products/:pid', checkSession, async (req, res) => {
    try {
        const { pid, cid } = req.params;
        console.log( pid, cid );

        const result = await cartModel.updateOne(
            { _id: cid },
            { $pull: { arrayCart: { product: pid } } } //RECORDAR QUE ESTE PID ES EL ID DEL PRODUCT DE NUESTRO ESQUEMA
        );                                              //NO ES EL ID GENERADO POR MONGO

        res.send({
            result: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.send({
            status: 'Error',
            error: 'Se produjo un error fatal'
        });
    }
});

async function HayStock(id, quantity) {
    //const producto = productModel.findById(id);
    const producto = await getProductsByID(id);
    const stock =  producto.stock;
    //console.log('producto:', producto, '  quantity:', quantity, stock);
    if (stock < quantity) {
        console.log('false');
        return false;
    } else {
        console.log('true');
        return true;
    }
}

router.post('/:cid/purchase', checkSession, async (req, res) => {
    try {
        const { cid } = req.params;

        let carrito = await getProductsOfCart(cid);
        let totalCarrito = 0;
        let cantidadItems = 0;
        let cartItems = [];
        let cartItemsSinStock = [];
        let arrayCartPendientes = [];
        let msj = "";

        if (carrito) {
            await Promise.all(carrito.arrayCart.map(async (item) => {
                let hayStock = await HayStock(item.product, item.quantity);
                if (hayStock) {
                    const id = item.product;
                    const stockAReducir = item.quantity;
                
                    console.log(id._id, stockAReducir);
                    const result = await updateProduct({ _id: id }, { $inc: { stock: -stockAReducir } });

                    const subtotal = stockAReducir * item.product.price;
                    totalCarrito += subtotal;
                    cantidadItems += item.quantity;
                    console.log('Entro en el if');
                } else {
                    arrayCartPendientes.push(item);
                    cartItemsSinStock.push(item.product._id);
                }
            }));    
        }

        const newTicket = {
            amount: totalCarrito,
            purchaser: "EstebanCoder"
        };
                
        const ticketCompra = await addTicket(newTicket); /// GENERAR TICKET

        const prodSinComprar = await updateProductsInCart(cid, arrayCartPendientes);
        res.send({
            result: 'success',
            payload: cartItemsSinStock
        });

    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    }
});



export default router;
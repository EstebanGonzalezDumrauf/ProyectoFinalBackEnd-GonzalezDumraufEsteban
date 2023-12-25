import {
    Router
} from 'express';
import {
    productModel
} from '../models/product.js';
import mongoose from 'mongoose';
import {
    deleteProductPremium,
    getProductsByID
} from '../controllers/products.js';
import { checkSession, checkAdmin } from "../config/passport.js";


import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { generatePaginateErrorInfo, generateProductErrorInfo } from '../services/errors/info.js';
import { getUser } from '../controllers/sessions.js';


const router = Router();


router.get('/', async (req, res) => {
    try {
        const {
            limit = 10, page = 1, query, sort
        } = req.query;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            CustomError.createError({
                name: 'Errores en los parámetros Limit y Page',
                cause: generatePaginateErrorInfo({ limit, page }),
                message: 'Los parámetros limit y page deben ser números válidos y mayores que cero',
                code: EErrors.INVALID_TYPES_ERROR
            });

            //revisar para crear un custom message de errors !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            return res.status(400).json({
                result: 'error',
                message: 'Los parámetros "limit" y "page" deben ser números válidos y mayores que cero'
            });
        }

        const options = {
            limit: parsedLimit,
            page: parsedPage,
        };

        if (sort) {
            if (sort === 'asc') {
                options.sort = {
                    price: 1
                };
            } else if (sort === 'desc') {
                options.sort = {
                    price: -1
                };
            }
        }

        let productos = {};
        const strQuery = req.query.query;

        if (!isNaN(strQuery)) {
            productos = await productModel.paginate({
                stock: {
                    $gt: parseInt(strQuery)
                }
            }, options);
        } else {
            productos = await productModel.paginate({
                category: {
                    $regex: new RegExp(strQuery, 'i')
                }
            }, options);
        }

        res.status(200).json({
            result: 'success',
            payload: productos,
        });
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});


router.get('/:pid', async (req, res) => {
    const {
        pid
    } = req.params;
    try {
        //console.log('Datos recibidos:', pid);
        const producto = await getProductsByID(pid)

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            result: 'success',
            payload: producto
        });
    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});


router.post('/', async (req, res) => {
    try {
        let {
            title,
            description,
            price,
            category,
            status,
            thumbnail,
            code,
            owner,
            stock
        } = req.body;

        if (!title || !code) {
            CustomError.createError({
                name: 'Valores incompletos en la Incorporacion de un producto',
                cause: generateProductErrorInfo({
                    title,
                    description,
                    price,
                    category,
                    status,
                    thumbnail,
                    code,
                    owner,
                    stock
                }),
                message: 'Falta ingresar el title o el code del producto ',
                code: EErrors.INVALID_TYPES_ERROR
            });

            return res.send({
                status: "Error",
                error: 'Datos incompletos'
            });
        }

        console.log({
            title,
            description,
            price,
            category,
            status,
            thumbnail,
            code,
            owner,
            stock
        });
        let result = await productModel.create({
            title,
            description,
            price,
            category,
            status,
            thumbnail,
            code,
            owner,
            stock
        });

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

router.put('/:pid', async (req, res) => {
    try {
        let datosAUpdate = req.body;
        let { pid } = req.params;

        let result = await productModel.updateOne({ _id: pid }, datosAUpdate);

        // const producto = await getProductsByID(pid)

        // if (!producto) {
        //     return res.status(404).json({
        //         result: 'error',
        //         message: 'Producto no encontrado'
        //     });
        // }

        // if ((!req.session.user && req.session.user.rol !== 'admin') || 
        // (!req.session.user && req.session.user.email !== producto.owner)) {
        //     req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        //     return res.status(401).send({
        //         status: "Error",
        //         error: 'No autorizado'
        //     });
        // }

        // console.log(req.session.user);
        // {
        //     _id: '655377cde55773f7b67f82d8',
        //     first_name: 'Esteban',
        //     last_name: 'Gonzalito',
        //     email: 'esteban_a_gd@hotmail.com',
        //     age: 44,
        //     password: '$2b$10$iMFRdQh0Ueywy0BUemcEru26ucmBhPzlr1E.VcKLrMmBdDBhj66.6',
        //     cart: '64fcae446abbc5ebaf62c79a',
        //     rol: 'usuario',
        //     fecha_ultima_conexion: '2023-11-17T14:37:42.270Z',
        //     __v: 0
        //   }

        res.status(200).send({
            result: 'success',
            payload: result
        });
    } catch (error) {
        if (error.code === 11000) {
            // Manejar el error de clave duplicada
            res.status(400).json({
                result: 'error',
                message: 'Ya existe un producto con el mismo código.'
            });
        } else {
            // Manejar otros errores
            res.status(500).json({
                result: 'error',
                message: 'Error interno del servidor.'
            });
        }
    }
});



// router.put('/:pid', async (req, res) => {

//     let datosAUpdate = req.body;
//     let {
//         pid
//     } = req.params;

//     // const producto = await getProductsByID(pid)

//     // if (!producto) {
//     //     return res.status(404).json({
//     //         result: 'error',
//     //         message: 'Producto no encontrado'
//     //     });
//     // }

//     // if ((!req.session.user && req.session.user.rol !== 'admin') || 
//     // (!req.session.user && req.session.user.email !== producto.owner)) {
//     //     req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
//     //     return res.status(401).send({
//     //         status: "Error",
//     //         error: 'No autorizado'
//     //     });
//     // }

//     // console.log(req.session.user);
//     // {
//     //     _id: '655377cde55773f7b67f82d8',
//     //     first_name: 'Esteban',
//     //     last_name: 'Gonzalito',
//     //     email: 'esteban_a_gd@hotmail.com',
//     //     age: 44,
//     //     password: '$2b$10$iMFRdQh0Ueywy0BUemcEru26ucmBhPzlr1E.VcKLrMmBdDBhj66.6',
//     //     cart: '64fcae446abbc5ebaf62c79a',
//     //     rol: 'usuario',
//     //     fecha_ultima_conexion: '2023-11-17T14:37:42.270Z',
//     //     __v: 0
//     //   }

//     let result = await productModel.updateOne({
//         _id: pid
//     }, datosAUpdate);

//     res.status(200).send({
//         result: 'sucess',
//         payload: result
//     });
// })

router.delete('/:pid', async (req, res) => {

    let {
        pid
    } = req.params;

    const producto = await getProductsByID(pid)

    if (!producto) {
        return res.status(404).json({
            result: 'error',
            message: 'Producto no encontrado'
        });
    }

    const ownerProduct = producto.owner;
console.log("ownerProduct", ownerProduct);

    if (ownerProduct !== "admin") {
        const userProduct = await getUser(ownerProduct);

        console.log("userProduct.rol ", userProduct.rol);

        if (userProduct.rol === "premium") {    
            const result = await deleteProductPremium(pid, ownerProduct);
            return res.send({
                result: 'sucess',
                payload: result
            });
        }
    }



    // if ((!req.session.user && req.session.user.rol !== 'admin') || 
    // (!req.session.user && req.session.user.email !== producto.owner)) {
    //     req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    //     return res.send({
    //         status: "Error",
    //         error: 'No autorizado'
    //     });
    // }

    let result = await productModel.deleteOne({
        _id: pid
    });

    res.send({
        result: 'sucess',
        payload: result
    });
})

export default router;
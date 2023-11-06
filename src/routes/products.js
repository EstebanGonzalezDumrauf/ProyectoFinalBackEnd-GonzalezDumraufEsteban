import {
    Router
} from 'express';
import {
    productModel
} from '../models/product.js';
import mongoose from 'mongoose';
import {
    getProductsByID
} from '../controllers/products.js';
import {checkSession, checkAdmin} from "../config/passport.js";


import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { generatePaginateErrorInfo, generateProductErrorInfo } from '../services/errors/info.js';


const router = Router();


router.get('/', async (req, res) => {
    //try {
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
    // } catch (error) {
    //     res.status(500).json({
    //         result: 'error',
    //         message: 'Hubo un error en el servidor',
    //     });
    // }
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
        console.error(error);
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

        let result = await productModel.create({
            title,
            description,
            price,
            category,
            status,
            thumbnail,
            code,
            stock
        });

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }

})

router.put('/:pid', checkAdmin, async (req, res) => {

    let datosAUpdate = req.body;
    let {
        pid
    } = req.params;

    let result = await productModel.updateOne({
        _id: pid
    }, datosAUpdate);

    res.send({
        result: 'sucess',
        payload: result
    });
})

router.delete('/:pid', checkAdmin, async (req, res) => {

    let {
        pid
    } = req.params;

    let result = await productModel.deleteOne({
        _id: pid
    });

    res.send({
        result: 'sucess',
        payload: result
    });
})

export default router;
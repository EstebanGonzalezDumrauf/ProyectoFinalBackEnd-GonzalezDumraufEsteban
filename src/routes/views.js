import {
    Router
} from "express";
import {
    productModel
} from '../models/product.js';
import {
    cartModel
} from '../models/cart.js';
import {
    authToken, generateProducts
} from "../utils.js";
import {
    getProductsOfCart
} from '../controllers/carts.js'
import {
    checkSession,
    checkAdmin
} from "../config/passport.js";
import { getAllUser } from "../dao/mongo/sessions.js";


const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

router.get('/', publicAccess, (req, res) => {
    res.render('login');
})

router.get('/chat', checkSession, (req, res) => {
    res.render('chat', {});
})

router.get('/loggerTest', (req, res) => {
    let testeandoLogs = '';

    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    req.logger.warning(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    req.logger.fatal(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);

    res.send({status: 'sucess', payload: testeandoLogs});
})

router.get('/register', publicAccess, (req, res) => {
    res.render('register')
})

router.get('/resetPassword', publicAccess, (req, res) => {
    res.render('reset')
})

router.get('/mailPassword', publicAccess, (req, res) => {
    res.render('mail')
})

//router.get('/users', checkAdmin, async (req, res) => {
router.get('/users', checkAdmin, async (req, res) => {
    try {
        let listado = []; 
        
        listado = await getAllUser();

        if (listado) {
            res.render('admin', { docs: listado });
        } else {
            res.render('admin', { listado: [] });
        }

    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    }
});

router.get('/products', checkSession, async (req, res) => {
    //router.get('/products', authToken, async (req, res) => {
    const {
        page = 1
    } = req.query;

    const {
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    } = await productModel.paginate({}, {
        limit: 5,
        page
    })

    const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;

    const pageNumbers = Array.from({
        length: totalPages
    }, (_, i) => i + 1);


    // Verifica que el usuario está autenticado antes de mostrar la página de productos
    if (req.session.user) {
        const {
            username,
            isAdmin
        } = req.session.user;
    } else {
        // Si el usuario no está autenticado, redirige a la página de loggin
        return res.redirect('/');
    }


    const productsWithCart = docs.map(product => ({
        ...product,
        cart: req.user.cart
    }));


    const cartId = req.user.cart;

    // Consulta el modelo de carrito para obtener la suma total de cantidades
    const cart = await cartModel.findOne({
        _id: cartId
    });

    // Calcula la suma total de cantidades en el carrito
    const totalQuantity = cart ? cart.arrayCart.reduce((total, item) => total + item.quantity, 0) : 0;



    res.render('index', {
        docs: productsWithCart,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        prevLink,
        nextLink,
        pageNumbers,
        user: req.session.user,
        cantidadItems: totalQuantity
    });
})

router.get('/mockingproducts', checkSession, async (req, res) => {

    const productsMocking = [];

    for (let index = 0; index < 100; index++) {
        productsMocking.push(generateProducts());
    }


    // Verifica que el usuario está autenticado antes de mostrar la página de productos
    if (req.session.user) {
        const {
            username,
            isAdmin
        } = req.session.user;
    } else {
        // Si el usuario no está autenticado, redirige a la página de loggin
        return res.redirect('/');
    }

    res.send({status: 'sucess', payload: productsMocking});
})

router.get('/api/products/:pid', checkSession, async (req, res) => {
    try {
        const productId = req.params.pid;
        const producto = await productModel.findById(productId);

        const cartId = req.user.cart;

        // Consulta el modelo de carrito para obtener la suma total de cantidades
        const cart = await cartModel.findOne({
            _id: cartId
        });
    
        // Calcula la suma total de cantidades en el carrito
        const totalQuantity = cart ? cart.arrayCart.reduce((total, item) => total + item.quantity, 0) : 0;

        const productoLimpiado = {
            _id: productId,
            title: producto.title,
            description: producto.description,
            price: producto.price,
            thumbnail: producto.thumbnail
        };

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.render('detail', {
            product: productoLimpiado,
            cartUrl: '/cart',
            user: req.session.user, 
            cart: cart._id,
            cantidadItems: totalQuantity
        });

    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});

router.get('/carts/:cid', checkSession, async (req, res) => {
    try {
        const {
            cid
        } = req.params;

        //let carrito = await cartModel.findOne({ _id: cid }).populate('arrayCart.product');
        let carrito = await getProductsOfCart(cid);
        let totalCarrito = 0;
        let cantidadItems = 0;
        let cartItems = [];

        if (carrito) {
            cartItems = carrito.arrayCart.map(item => {
                const subtotal = item.quantity * item.product.price;
                totalCarrito += subtotal;
                cantidadItems += item.quantity;
                return {
                    cart: cid,
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    id: item.product._id,
                    thumbnail: item.product.thumbnail,
                    subtotal: subtotal,
                };
            });
            //console.log(cartItems, totalCarrito);
        }

        res.render('cart', {
            cartProducts: cartItems,
            totalCarrito,
            cantidadItems,
            cart: cid,
            user: req.session.user
        });

    } catch (error) {
        req.logger.error(`${error} - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    }
});

export default router;
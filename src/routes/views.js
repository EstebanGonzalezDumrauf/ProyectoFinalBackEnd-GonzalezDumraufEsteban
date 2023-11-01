import { Router } from "express";
import {
    productModel
} from '../models/product.js';
import {
    cartModel
} from '../models/cart.js';
import { authToken } from "../utils.js";
import { getProductsOfCart } from '../controllers/carts.js'
import {checkSession, checkAdmin} from "../config/passport.js";

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

router.get('/', publicAccess, (req, res)=> {
    res.render('login');
})

router.get('/chat', checkSession, (req, res) => {
    res.render('chat', {});
    })

router.get('/register', publicAccess, (req, res)=> {
    res.render('register')
})

router.get('/resetPassword', publicAccess, (req, res)=> {
    res.render('reset')
})

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

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);


    // Verifica que el usuario está autenticado antes de mostrar la página de productos
    if (req.session.user) {
        const { username, isAdmin } = req.session.user;
        //const { cart } = req.user.cart;
        //console.log(cart);
        //console.log(req.user);
    } else {
        // Si el usuario no está autenticado, redirige a la página de loggin
        return res.redirect('/');
    }

    res.render('index', {
        cart: req.user.cart,
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        prevLink,
        nextLink,
        pageNumbers, 
        user: req.session.user,
        cart: req.user.cart
    });
})

router.get('/api/products/:pid', checkSession, async (req, res) => {
    try {
        //console.log('Datos recibidos:', pid);
        const productId = req.params.pid;
        const producto = await productModel.findById(productId);

        const productoLimpiado = {
            title: producto.title,
            description: producto.description,
            price: producto.price,
            thumbnail: producto.thumbnail,
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
            user: req.session.user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});

router.get('/carts/:cid', checkSession, async (req, res) => {
    try {
        const { cid } = req.params;

        //let carrito = await cartModel.findOne({ _id: cid }).populate('arrayCart.product');
        let carrito = await getProductsOfCart(cid);
        let totalCarrito = 0;
        let cantidadItems = 0;
        let cartItems= [];

        if (carrito) {
            cartItems = carrito.arrayCart.map(item => {
                const subtotal = item.quantity * item.product.price;
                totalCarrito += subtotal;
                cantidadItems += item.quantity;
                return {
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    id: item._id,
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
            user: req.session.user
        });

    } catch (error) {
        console.log(error);
    }
});

export default router;
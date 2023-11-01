import { Router } from "express";
import { userModel } from "../models/user.js";
import UserDTO from '../dao/DTOs/users.js';
import { getSession, resetPassword, logout } from "../controllers/sessions.js"
import { createHash, generateToken, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.get('/github', passport.authenticate('github', { scope: ['email'] }), async (req, res) => {
    console.log('pasó x aca');
});

router.get('/githubCallback', passport.authenticate('github', { failureRedirect: '/failLoginGit' }), async (req, res) => {
    console.log('todo bien con git');
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/failLoginGit', (req, res) => {
    res.send({ error: "Failed Login con GitHub" });
});


router.get('/current', (req, res) => {
    // Crea un nuevo objeto UserDTO a partir de req.user
    const userDTO = new UserDTO(req.user);

    // Envía el objeto UserDTO en la respuesta
    res.send({ status: "success", payload: userDTO });
    //res.send({ status: "success", payload: req.user });//.redirect('/products');
});


router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin' }), async (req, res) => {
    if (!req.user) {
        console.log("entro aca ");
        return res.status(400).send({ status: "error", error: "Credenciales invalidas" });
    }
    delete req.user.password;
    req.session.user = req.user;
    res.send({ status: "success", payload: req.user })
});

router.get('/failLogin', (req, res) => {
    return res.status(400).send({ status: "error", error: "Usuario no existe o password incorrecto" });
});

router.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" })
})

router.get('/failRegister', async (req, res) => {
    console.log("Fallo la estrategia");
    res.send({ error: "Failed register" });
})

router.post('/resetPassword', async (req, res) => {
    const { email, password } = req.body;
    resetPassword(email, password);
    res.send({ status: "success", message: "password reseteado" })
})

router.post('/logout', async (req, res) => {
    const result = await logout(req, res);
    return result;
});

export default router;
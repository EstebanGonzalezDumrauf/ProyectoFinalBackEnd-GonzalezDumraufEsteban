import {
    Router
} from "express";
import UserDTO from '../dao/DTOs/users.js';
import {
    getSession,
    resetPassword,
    logout,
    deleteUser,
    getUser,
    getUserById,
    updateUser,
    deleteInactiveUsers
} from "../controllers/sessions.js"
import {
    createHash,
    generateToken,
    isValidPassword
} from "../utils.js";
import passport from "passport";
import { now } from "mongoose";

const router = Router();

router.get('/github', passport.authenticate('github', {
    scope: ['email']
}), async (req, res) => {});

router.get('/githubCallback', passport.authenticate('github', {
    failureRedirect: '/failLoginGit'
}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/failLoginGit', (req, res) => {
    res.send({
        error: "Failed Login con GitHub"
    });
});


router.get('/current', (req, res) => {
    // Crea un nuevo objeto UserDTO a partir de req.user
    const userDTO = new UserDTO(req.user);

    // Envía el objeto UserDTO en la respuesta
    res.send({
        status: "success",
        payload: userDTO
    });
});


router.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/sessions/failLogin'
}), async (req, res) => {
    if (!req.user) {
        console.log("entro aca ");
        return res.status(400).send({
            status: "error",
            error: "Credenciales invalidas"
        });
    }
    delete req.user.password;
    req.session.user = req.user;

    
    req.user.fecha_ultima_conexion = Date.now();

    console.log('datos del usuario', req.user);
    const result = await updateUser(req.user);
    res.send({
        status: "success",
        payload: req.user
    })
});

router.get('/failLogin', (req, res) => {
    req.logger.warning(`Usuario no existe o password incorrecto - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    return res.status(400).send({
        status: "error",
        error: "Usuario no existe o password incorrecto"
    });
});

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failRegister'
}), async (req, res) => {
    res.send({
        status: "success",
        message: "Usuario registrado"
    })
})

router.get('/failRegister', async (req, res) => {
    req.logger.info(`Failed register - ${req.method} en ${req.url} - ${new Date().toLocaleDateString()} `);
    res.send({
        error: "Failed register"
    });
})

router.post('/resetPassword', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    resetPassword(email, password);
    res.send({
        status: "success",
        message: "password reseteado"
    })
})

router.post('/logout', async (req, res) => {
    const result = await logout(req, res);
    return result;
});

router.delete('/:uid', async (req, res) => {
    const {
        uid
    } = req.params;
    const user = await getUserById(uid);
    console.log(user, uid);
    const IsBorrado = await deleteUser(user);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////// ver mail al usuario ///////////////////////////////////////////////////////////
    if (IsBorrado) {
        res.status(200).json({
            message: 'Usuario eliminado'
        });
    }
});

router.delete('/inactivos', async (req, res) => {
    const deletedCount = await deleteInactiveUsers();
    
    if (deletedCount > 0) {
        res.status(200).json({
            message: `${deletedCount} usuarios eliminados`
        });
    } else {
        res.status(200).json({
            message: 'No se encontraron usuarios para eliminar'
        });
    }
});

export default router;
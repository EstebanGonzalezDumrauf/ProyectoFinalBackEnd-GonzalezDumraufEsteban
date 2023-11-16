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
} from "../controllers/sessions.js";
import {
    createHash,
    generateToken,
    isValidPassword
} from "../utils.js";
import passport from "passport";
import { now } from "mongoose";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../config/config.js';
import {
    checkSession,
    checkAdmin
} from "../config/passport.js";

const router = Router();

router.get('/github', passport.authenticate('github', {
    scope: ['email']
}), async (req, res) => { });

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


router.post('/resetPassword/:token', async (req, res) => {
    const { email, password } = req.body;
    const token = req.params.token;

    console.log(token);
    if (!token) {
        return res.status(401).send('Token no proporcionado.');
    }

    jwt.verify(token, 'secreto', async (err, decoded) => {
        if (err) {
            return res.status(401).send('Enlace no válido o ha expirado.');
        }

        try {
            const result = await resetPassword(email, password);

            if (result.status === 'errorIgual') {
                return res.status(402).send({
                    status: "error",
                    error: "El password debe ser distinto al existente."
                });
            }

            if (result.status === 'errorUser') {
                return res.status(400).send({
                    status: "error",
                    error: "El usuario no existe o el email no es correcto."
                });
            }

            return res.status(200).send({
                status: "success",
                message: "Contraseña reseteada exitosamente"
            });
        } catch (error) {
            console.error('Error al resetear la contraseña:', error);
            res.status(500).send({
                status: "error",
                error: "Error al resetear la contraseña"
            });
        }
    });
});



router.post('/mailPassword', async (req, res) => {
    const {
        email
    } = req.body;

    if (email) {
        try {
            const token = jwt.sign({ email }, 'secreto', { expiresIn: '1h' });
            const resetLink = `http://localhost:8080/resetPassword?token=${token}`;

            let result = await transport.sendMail({
                from: 'Administrador Coder <esteban.a.gonzalez.d@gmail.com>',
                to: `${email}`,
                subject: 'Solicitud de restauracion de contraseña',
                html: `<div>
                <h1> Para ello debe hacer click en el siguiente <a href="${resetLink}">link</a>. </h1>
             </div>`,
                attachments: []
            })

            // Si el envío de correo fue exitoso
            res.status(200).json({
                message: 'Correo enviado con éxito'
            });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({
                error: 'Error al enviar el correo'
            });
        }
    } else {
        res.status(400).json({
            error: 'Correo electrónico no proporcionado'
        });
    }
})

router.post('/logout', async (req, res) => {
    const result = await logout(req, res);
    return result;
});

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'gribsserversiag@gmail.com',
        pass: config.passGmail
    },
    tls: {
        rejectUnauthorized: false
    }
})

router.delete('/:uid', async (req, res) => {
    const {
        uid
    } = req.params;
    const user = await getUserById(uid);
    console.log(user, uid);
    const email = user.email;
    const IsBorrado = await deleteUser(user);

    if (IsBorrado) {
        if (email) {
            let result = await transport.sendMail({
                from: 'Administrador Coder <esteban.a.gonzalez.d@gmail.com>',
                to: `${email}`,
                subject: 'Su Usuario fue Eliminado por el Administrador',
                html: `<div> <h1> Su Usuario fue eliminado por el Administrador de Coder. </h1></div>`,
                attachments: []
            })
        }
        res.status(200).json({
            message: 'Usuario eliminado'
        });
    }
});

router.post('/inactivos', checkAdmin, async (req, res) => {
    const deletedCount = await deleteInactiveUsers();

    if (deletedCount) {
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
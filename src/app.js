import express from 'express';
import __dirName from './utils.js';
import path from 'path'; // Importa el módulo path
import handlebars from 'express-handlebars';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js'
import viewsRouter from './routes/views.js';
import sessionsRouter from './routes/sessions.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { initializePassport } from './config/passport.js';
import { checkSession, checkAdmin } from "./config/passport.js";
import config from './config/config.js';
import cors from 'cors';
import errorHandler from './middlewares/errors/index.js';

import {
    Server
} from "socket.io";
import {
    chatModel
} from './models/chat.js';
import MongoSingleton from './class/MongoSingleton.js';

const app = express();

app.engine('handlebars', handlebars.engine());
//app.set('views', __dirName, '/views');
app.set('views', path.join(__dirName, 'views'));
app.set('view engine', 'handlebars');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirName + '/public'));
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoURL,
        ttl: 5000
    }),
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
//app.use('/', loginsRouter);
app.use('/api/sessions', sessionsRouter);
//app.use('/', registersRouter);
app.use('/chat', chatModel);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use(errorHandler);

const connection = MongoSingleton.getInstance();

// mongoose.connect(config.mongoURL,{
//         useNewUrlParser: true,
//         useUnifiedTopology: true
// });

const server = app.listen(config.port, () => {
    console.log(`Server ON en puerto ${config.port}`);
});

const io = new Server(server);

let messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', async data => {
        messages.push(data);

        try {
            const {
                user,
                message
            } = data;
            const chatMessage = new chatModel({
                user,
                message
            });

            //Se persiste en Mongo
            const result = await chatMessage.save();

            console.log(`Mensaje de ${user} persistido en la base de datos.`);
        } catch (error) {
            console.error('Error al persistir el mensaje:', error);
        }

        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })

})
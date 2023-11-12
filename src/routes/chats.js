import {
    Router
} from 'express';
import {
    chatModel
} from '../dao/models/chat.js';

router.post('/chat', async (req, res) => {

    try {
        let {
            user,
            message
        } = req.body;

        let result = await chatModel.create({
            user,
            message
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
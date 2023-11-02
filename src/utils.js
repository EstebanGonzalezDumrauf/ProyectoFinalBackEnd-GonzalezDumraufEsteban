import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { fakerES_MX } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirName = dirname(__filename);

const PRIVATE_KEY = "KeyQueFuncionaComoSecretJWT";

export const generateProducts = () => {
    const numOfProducts = 100;

    return {
        title: fakerES_MX.commerce.productName(),
        description: fakerES_MX.commerce.productDescription(),
        price: fakerES_MX.commerce.price(),
        category: fakerES_MX.commerce.productAdjective(),
        status: fakerES_MX.datatype.boolean(),
        thumbnail: fakerES_MX.image.url(),
        code: fakerES_MX.string.uuid(),
        stock: fakerES_MX.string.numeric(2)
    }
}

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'});
    return token;
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({error: "Not Authenticated"});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) {
            return res.status(403).send({error: "Not Authorizated"});
        }
        req.user = credentials.user;
        next();
    })

}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export default __dirName;

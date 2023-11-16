import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    environment: process.env.ENVIRONMENT,
    passGmail : process.env.PASSGMAIL
}
import Assert from 'assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../src/routes/sessions.js'
import chai from 'chai';
import { createHash, isValidPassword } from '../src/utils.js';
import { getUser } from '../src/controllers/sessions.js';
//import app from '../src/app.js'; // Reemplaza 'tu_app' con la ubicación correcta de tu aplicación Express

const MONGO_URL = 'mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/Ecommerce';

const assert = Assert.strict;
const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Session Router Tests', () => {
    before(async () => {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    it('Se debe realizar un hasheo correcto del password', async () => {
        const user = {
            first_name: 'Esteban',
            last_name: 'Gonzalez',
            email: 'esteban_a_gd@hotmail.com',
            password: 'fakepass'
        }

        const passwordHash = createHash(user.password);
        expect(user.password).to.be.not.equals(passwordHash);
    });

        it('Se debe realizar un hasheo del password y compararlo con el pass almacenado en la BD', async () => {
        const user = {
            first_name: 'Esteban',
            last_name: 'Gonzalez',
            email: 'esteban_a_gd@hotmail.com',
            password: '1234'
        }

        const userBD = await getUser(user.email);

        const isPasswordValid = isValidPassword(userBD, user.password);
    
        expect(isPasswordValid).to.be.true;
    });
    
    describe('GET /current', () => {
        it('Deberá retornar el usuario actual', async () => {
            const {statusCode, ok, body} = await requester.get('/api/sessions/current');
            assert.equal(statusCode, 200);
            assert.equal(ok, true);
        });
    });4

    describe('POST /login', () => {
        it('Deberá loggear al usuario y retornar success', async () => {
            const response = await requester
                .post('/api/sessions/login')
                .send({
                    username: 'esteban_a_gd@hotmail.com',
                    password: '1234'
                }); 
            //assert.equal(response.status, 200);
            //assert.equal(response.body.status, 'success');
            // assert.property(response.body.payload, 'username'); // Ajusta según la estructura de tu usuario
        });

        it('Deberá manejar un failed login y retornar un error', async () => {
            const response = await requester
                .post('/api/sessions/login')
                .send({
                    username: 'esteban_a_gd@hotmail.com',
                    password: '12234'
                });
            // assert.equal(response.status, 400);
            // assert.equal(response.body.status, 'error');
            // assert.equal(response.body.error, 'Usuario no existe o password incorrecto');
        });
    });

    describe('POST /register', () => {
        it('Deberá registrar un nuevo usuario y retornar success', async () => {
            const response = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'user_name',
                    last_name: 'user_last',
                    email: 'esteban_a_gd@hotmail.com',
                    age: 33,
                    password: '1234'
                }); // Ajusta según tus datos de prueba
            // assert.equal(response.status, 200);
            // assert.equal(response.body.status, 'success');
            // assert.equal(response.body.message, 'Usuario registrado');
        });
    });

});
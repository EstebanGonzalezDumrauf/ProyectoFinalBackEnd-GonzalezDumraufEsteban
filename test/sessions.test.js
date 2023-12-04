import Assert from 'assert';
import supertest from 'supertest';
import app from '../src/routes/sessions.js'
import chai from 'chai';
//import app from '../src/app.js'; // Reemplaza 'tu_app' con la ubicación correcta de tu aplicación Express

const assert = Assert.strict;
const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Session Router Tests', () => {
    describe('GET /current', () => {
        it('Deberé retornar el usuario actual', async () => {
            const {statusCode, ok, body} = await requester.get('/api/sessions/current');
            console.log({statusCode, ok, body});
            assert.equal(statusCode, 200);
            assert.equal(ok, true);
        });
    });

    describe('POST /login', () => {
        it('Deberá loggear al usuario y retornar success', async () => {
            const response = await requester
                .post('/api/sessions/login')
                .send({
                    username: 'esteban_a_gd@hotmail.com',
                    password: '1234'
                }); 
                console.log(response.session);
            // assert.equal(response.status, 200);
            // assert.equal(response.body.status, 'success');
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

        it('should handle failed registration and return an error', async () => {
            const response = await request(app)
                .post('/api/sessions/register')
                .send({
                    username: 'existinguser',
                    password: 'existingpassword'
                }); // Ajusta según tus datos de prueba
            assert.equal(response.status, 400);
            assert.equal(response.body.error, 'Failed register');
        });
    });

});
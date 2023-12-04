import Assert from 'assert';
import supertest from 'supertest';
import app from '../src/routes/carts.js'
import chai from 'chai';

const expect = chai.expect;
const assert = Assert.strict;
const requester = supertest('http://localhost:8080')

describe('Cart Router Tests', () => {
    describe('GET /', () => {
        it('Deberá retornar una lista de carts', async () => {
            const response = await requester
                .get('/api/carts'); 
                console.log(response.body);
            assert.equal(response.status, 200);
            assert.equal(response.body.result, 'sucess'); 
            assert.strictEqual(Array.isArray(response.body.payload), true); 
        });
    });

    describe('POST /', () => {
        it('Deberá crear un nuevo cart', async () => {
            const response = await requester
                .post('/api/carts')
                .send({
                    arrayCart: []
                }); 
            assert.equal(response.status, 200);
            assert.equal(response.body.result, 'sucess'); 
        });
    });

    describe('PUT /:cid/products/:pid', () => {
        it('Deberá manejar una cantidad NO válida y retornar un error', async () => {
            const response = await requester
                .put('/api/carts/6568ce9c17f477df3372aa74/products/64f64df102c0446eb31d7baf')
                .send({
                    quantity: -1
                }); 
            assert.equal(response.status, 400);
            assert.equal(response.body.result, 'error'); 
            assert.equal(response.body.message, 'La cantidad proporcionada no es válida');
        });
    });

    // Agrega más pruebas según sea necesario para otros endpoints del router
});
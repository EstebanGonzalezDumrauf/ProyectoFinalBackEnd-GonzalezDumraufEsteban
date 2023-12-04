import chai from "chai"; //import { expect } from 'chai';
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080')



describe('Product Router Tests', () => {
    it('Deberá obtener una lista de productos', async () => {
        const response = await requester.get('/api/products');
        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal('success');
        expect(response.body.payload).to.be.an('object');
    });

    it('Deberá crear un nuevo producto', async () => {
        const response = await requester
            .post('/api/products')
            .send({
                title: 'TestTitle',
                description: 'descriptionFakeProduct',
                price: 9999,
                category: 'belleza',
                status: true,
                owner: "Administrador",
                thumbnail: [],
                code: 'AAA-9999',
                stock: 99
            });
            console.log(response.body);
        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal('sucess');
        expect(response.body.payload).to.be.an('object');
    });

    it('No debería actualizar un producto existente por repeticion de campo CODE', async () => {
        const response = await requester
            .put('/api/products/64f883ff8c5820c7d3aab6ca')
            .send({
                title: 'TestTitle',
                description: 'descriptionFakeProduct',
                price: 9999,
                category: 'belleza',
                status: true,
                owner: "Administrador",
                thumbnail: [],
                code: 'PER-132',
                stock: 99
            });
        expect(response.status).to.equal(400);
        expect(response.body.result).to.equal('error');
    });

    it('Deberia borrar un producto existente', async () => {
        const response = await requester
            .delete('/api/products/656dda8cedcde467638c2977');
        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal('sucess');
        expect(response.body.payload).to.be.an('object');
    });
});

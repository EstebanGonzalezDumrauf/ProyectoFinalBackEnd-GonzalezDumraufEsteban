import {
    expect
} from 'chai';
import mongoose from 'mongoose';
import {
    getAllProducts,
    get_Product_By_ID,
    update_Product,
} from '../src/dao/mongo/products.js';
import Assert from 'assert';

const MONGO_URL = 'mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/Ecommerce';

const assert = Assert.strict;

before(async () => {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(function () {
    this.timeout(5000);
});

after(async () => {
    await mongoose.disconnect();
});

describe('Product DAO Tests', () => {
    describe('getAllProducts', () => {
        it('Debería retornar un array de productos', async () => {
            const result = await getAllProducts();
            assert.strictEqual(Array.isArray(result), true)
        });
    });

    describe('get_Product_By_ID', () => {
        it('Debería retornar un producto por su ID', async () => {
            const fakeProductId = '64f64df102c0446eb31d7baf';
            const result = await get_Product_By_ID(fakeProductId);
            assert.ok(result._id);
        });
    });

    describe('update_Product', () => {
        it('deberia actualizar un producto por su ID', async () => {
            const IDFilter = {
                _id: '656c98c34bc5b3741d94cbb0'
            };
            const mockProduct = {
                title: 'TestTitle',
                description: 'descriptionFakeProduct',
                price: 9999,
                category: 'belleza',
                status: true,
                owner: "Administrador",
                thumbnail: [],
                code: 'AAA-9999',
                stock: 99
            }
            const result = await update_Product(IDFilter, mockProduct);
            assert.ok(result);
        });
    });
});
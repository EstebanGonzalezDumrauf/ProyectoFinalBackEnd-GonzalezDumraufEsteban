import mongoose from "mongoose";
import config from '../config/config.js';

export default class MongoSingleton {
    static #instance;

    constructor() {
        mongoose.connect(config.mongoURL,{useNewUrlParser: true, useUnifiedTopology: true});
    }

    static getInstance() {
        if (this.#instance){
            console.log('Already connected to Mongo');
            return this.#instance;
        }

        this.#instance = new MongoSingleton();
        console.log('Connected to Mongo');
        return this.#instance;
    }
}
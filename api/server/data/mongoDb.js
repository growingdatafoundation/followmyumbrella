'use strict';

const assert = require('assert');
const {
    MongoClient,
    ObjectId
} = require('mongodb');


let mongoDb = new WeakMap();


module.exports = class {

    constructor(mongodbUrl) {

        assert(mongodbUrl, `mongodbUrl is a required argument`);
        this.mongodbUrl = mongodbUrl;
        this.collections = new Map();
    }

    async getConnection() {

        if (!this.connection) {
            this.connection = await MongoClient.connect(this.mongodbUrl);
        }

        return this.connection;
    }

    async getCollection(collectionName) {

        let collection = this.collections.get(collectionName);
        if (!collection) {
            const db = await this.getConnection(collectionName)

            collection = db.collection(collectionName);
            this.collections.set(collectionName, collection);
        }

        return collection;
    }

    static ObjectId(id) {

        return ObjectId(id);
    }
}

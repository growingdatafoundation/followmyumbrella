'use strict';

const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
    env: process.env.NODE_ENV
};


const manifest = {
    $meta: 'This file defines the plot device.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/api'),
        labels: ['api']
    }],
    registrations: [
        {
            plugin: {
                register: './server/api/index',
                options: {
                    mongoDbUrl: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/historic'
                }
            },
            options: {
                select: ['api'],
                routes: {
                    prefix: '/api/v1/point-of-interest'
                }
            }
        },
        {
            plugin: {
                register: "good",
                options: {
                    ops: {
                        interval: 30000
                    },
                    reporters: {
                        console: [{
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{
                                log: '*',
                                response: '*',
                                ops: '*'
                            }]
                        }, {
                            module: 'good-console'
                        }, 'stdout']
                    }
                }
            }
        }
    ]
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};

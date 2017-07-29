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
            plugin: './server/api/index',
            options: {
                select: ['api'],
                routes: {
                    prefix: '/v1'
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

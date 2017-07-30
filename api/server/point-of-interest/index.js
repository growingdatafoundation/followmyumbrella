'use strict';

const PointsOfInterestService = require('../data/pointsOfInterest')
const {
    MongoClient
} = require('mongodb');
const Joi = require('joi');


const optionsSchema = Joi.object().keys({
    mongoDbUrl: Joi.string().required(),
});

exports.register = function(server, options, next) {

    Joi.assert(options, optionsSchema);

    let poiService;

    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {

            reply(poiService.getPointsOfInterest());
        }
    });

    server.route({
        method: 'GET',
        path: '/{id}',
        handler: function(request, reply) {

            reply(poiService.getPointOfInterest(request.params.id));
        }
    });

    server.route({
        method: 'GET',
        path: '/nearest',
        config: {
            validate: {
                query: Joi.object().keys({
                    long: Joi.number().required(),
                    lat: Joi.number().required(),
                    radius: Joi.number().default(1000)
                })
            }
        },
        handler: function(request, reply) {
            reply(poiService.getNearbyPointsOfInterest(
                request.query.long,
                request.query.lat,
                request.query.radius
            ));
        }
    });

    server.route({
        method: 'GET',
        path: '/searchtags',
        config: {
            validate: {
            query: Joi.object().keys({
                tags: Joi.string().default('')
            })
            }
        },
        handler: function(request, reply) {
            reply(poiService.getMatchingPointsOfInterest(
                request.query.tags.split(',')
            ));
        }
    });

    MongoClient.connect(options.mongoDbUrl)
        .then((db) => db.collection('pointOfInterests'))
        .then((pointOfInterestCollection) => {
            poiService = new PointsOfInterestService(pointOfInterestCollection);

            return next();
        });
};

exports.register.attributes = {
    name: 'follow-my-umbrella-point-of-interest'
};

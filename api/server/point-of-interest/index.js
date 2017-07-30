'use strict';

const PointsOfInterestService = require('../data/pointsOfInterest')
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
        config: {
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().required()
                })
            }
        },
        handler: function(request, reply) {

            reply(poiService.getPointOfInterest({
                id: request.params.id,
                extended: true
            }));
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

            reply(poiService.getNearbyPointsOfInterest(request.query));
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
            reply(poiService.getMatchingPointsOfInterest({
                tags: request.query.tags.split(',')
            }));
        }
    });

    poiService = new PointsOfInterestService(options.mongoDbUrl);

    return next();
};

exports.register.attributes = {
    name: 'follow-my-umbrella-point-of-interest'
};

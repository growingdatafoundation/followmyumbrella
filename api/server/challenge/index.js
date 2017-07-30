'use strict';

const ChallengeService = require('../data/challenges')
const {
    MongoClient
} = require('mongodb');
const Joi = require('joi');


const optionsSchema = Joi.object().keys({
    mongoDbUrl: Joi.string().required(),
});

exports.register = function(server, options, next) {

    Joi.assert(options, optionsSchema);

    let challengeService;

    // Challenge routes
    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {

            reply(challengeService.getChallenges());
        }
    });

    server.route({
        method: 'GET',
        path: '/{id}',
        handler: function(request, reply) {

            reply(challengeService.getChallenge(request.params.id));
        }
    });

    server.route({
        method: 'DELETE',
        path: '/{id}',
        handler: function(request, reply) {

            reply(challengeService.deleteChallenge(request.params.id));
        }
    });

    server.route({
        method: 'PUT',
        path: '/',
        config: {
            validate: {
                payload: Joi.object().keys({
                title: Joi.string().required(),
                qAndAPairs: Joi.array().items({
                    question: Joi.string().required(),
                    answer: Joi.string().default('')
                }).required(),
                pointOfInterest: Joi.string().required(),
                author: Joi.string().default('guest@followmyumbrella.com'),
            })
          }
        },
        handler: function(request, reply) {
          reply(challengeService.putChallenge(request.payload));
        }
    });

    MongoClient.connect(options.mongoDbUrl)
        .then((db) => db.collection('challenges'))
        .then((challengeCollection) => {
            challengeService = new ChallengeService(challengeCollection)

            return next();
        });
};

exports.register.attributes = {
    name: 'follow-my-umbrella-challenge'
};

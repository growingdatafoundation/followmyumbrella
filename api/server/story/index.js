'use strict';

const PointsOfInterestService = require('../data/pointsOfInterest')
const ContributedStoriesService = require('../data/contributedStories')
const {
    MongoClient
} = require('mongodb');
const Joi = require('joi');


const optionsSchema = Joi.object().keys({
    mongoDbUrl: Joi.string().required(),
});

exports.register = function(server, options, next) {

    Joi.assert(options, optionsSchema);

    let csService;

    // Contributed stories routes
    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {

            reply(csService.getContributedStories());
        }
    });

    server.route({
        method: 'GET',
        path: '/{id}',
        handler: function(request, reply) {

            reply(csService.getContributedStory(request.params.id));
        }
    });

    server.route({
        method: 'DELETE',
        path: '/{id}',
        handler: function(request, reply) {

            reply(csService.deleteContributedStory(request.params.id));
        }
    });

    server.route({
        method: 'PUT',
        path: '/',
        config: {
            validate: {
                payload: Joi.object().keys({
                title: Joi.string().required(),
                body: Joi.string().required(),
                pointOfInterest: Joi.string().required(),
                author: Joi.string().default('guest@followmyumbrella.com'),
            })
          }
        },
        handler: function(request, reply) {
          reply(csService.putContributedStory(request.payload));
        }
    });

    MongoClient.connect(options.mongoDbUrl)
        .then((db) => db.collection('contributedStories'))
        .then((contributedStoriesCollections) => {
            csService = new ContributedStoriesService(contributedStoriesCollections)

            return next();
        });
};

exports.register.attributes = {
    name: 'follow-my-umbrella-story'
};

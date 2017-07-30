'use strict';

const ContributedStoriesService = require('../data/contributedStories')
const Joi = require('joi');


const optionsSchema = Joi.object().keys({
    mongoDbUrl: Joi.string().required(),
});

exports.register = function(server, options, next) {

    Joi.assert(options, optionsSchema);

    const csService = new ContributedStoriesService(options.mongoDbUrl);

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
        config: {
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().required()
                }),
                query: Joi.object().keys({
                    extended: Joi.boolean().default(true)
                })
            }
        },
        handler: function(request, reply) {

            let options = {};
            options = Object.Assign(options, request.params);
            options = Object.Assign(options, request.query);

            return reply(options);

            // reply(csService.getContributedStory(options));
        }
    });

    server.route({
        method: 'DELETE',
        path: '/{id}',
        handler: function(request, reply) {

            reply(csService.deleteContributedStory(request.params));
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

    return next();
};

exports.register.attributes = {
    name: 'follow-my-umbrella-story'
};

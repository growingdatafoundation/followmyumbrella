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

    let poiService;
    let csService;

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
            reply(poiService.getPointsOfInterest(
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

  // Contributed stories routes
  server.route({
    method: 'GET',
    path: '/stories',
    handler: function(request, reply) {

      reply(csService.getContributedStories());
    }
  });

  server.route({
    method: 'GET',
    path: '/stories/{id}',
    handler: function(request, reply) {

      reply(csService.getContributedStory(request.params.id));
    }
  });

  server.route({
    method: 'DELETE',
    path: '/stories/{id}',
    handler: function(request, reply) {

      reply(csService.deleteContributedStory(request.params.id));
    }
  });

  server.route({
    method: 'PUT',
    path: '/story',
    config: {
      validate: {
        payload: Joi.object().keys({
          title: Joi.string().required(),
          body: Joi.string().required(),
          author: Joi.string().default('guest@followmyumbrella.com'),
        })
      }
    },
    handler: function(request, reply) {
      reply(csService.putContributedStory(request.payload));
    }
  });

    MongoClient.connect(options.mongoDbUrl)
        .then((db) => Promise.all([
            db.collection('pointOfInterests'),
		    db.collection('contributedStories')
        ]))
        .then(([pointOfInterestCollection, contributedStoriesCollections]) => {
            poiService = new PointsOfInterestService(pointOfInterestCollection);
            csService = new ContributedStoriesService(contributedStoriesCollections)

            return next();
        });
};

exports.register.attributes = {
    name: 'api'
};

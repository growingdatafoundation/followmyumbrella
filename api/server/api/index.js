'use strict';

const PointsOfInterestService = require('../data/pointsOfInterest')
const {
  MongoClient
} = require('mongodb');
const Joi = require('joi');


exports.register = function(server, options, next) {

  const mongoDbUrl = 'mongodb://localhost:27017/historic';
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
      reply(poiService.getPointsOfInterest(
        request.query.long,
        request.query.lat,
        request.query.radius
      ));
    }
  });

  MongoClient.connect(mongoDbUrl)
    .then((db) => {
			return db.collection('pointOfInterests');
		})
    .then((collect) => {
      poiService = new PointsOfInterestService(collect);
      next();
    })
};

exports.register.attributes = {
  name: 'api'
};

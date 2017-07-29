'use strict';

const PointsOfInterestService = require('../data/pointsOfInterest')
const {MongoClient} = require('mongodb');

exports.register = function (server, options, next) {

	const mongoDbUrl = 'mongodb://localhost:27017/historic';
	let poiService;

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            reply(poiService.getPointsOfInterest());
        }
    });

    server.route({
        method: 'GET',
        path: '/{id}',
        handler: function (request, reply) {

            reply(poiService.getPointOfInterest(request.params.id));
        }
    });

    MongoClient.connect(mongoDbUrl)
    	.then((db) => db.collection('pointOfInterests'))
    	.then(collect => {

    		poiService = new PointsOfInterestService(collect);
    		this.callSomething

    		next();
    	})
};

exports.register.attributes = {
    name: 'api'
};

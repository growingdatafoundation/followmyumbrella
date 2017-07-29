'use strict';

const assert = require('assert');
const {ObjectId} = require('mongodb');


module.exports = class PointsOfInterestService {

	constructor(collection) {

		assert(collection !== undefined, 'Collection is a required argument');

		this.collection = collection;
	}

	/**
	 * Returns all points of interest
	 */
	getPointsOfInterest() {

		return this.collection.find().toArray();
	}

	/**
	 * Returns a single point of interest
	 */
	getPointOfInterest(id) {

		return this.collection.findOne({ _id: ObjectId(id) });
	}
}
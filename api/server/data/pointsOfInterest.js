'use strict';

const assert = require('assert');
const {
  ObjectId
} = require('mongodb');


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

        return this.collection.findOne({
            _id: ObjectId(id)
        });
    }

    /**
    * Returns points of interest near the location within the supplied radius
    */
    getNearbyPointsOfInterest(long, lat, radius) {

        return this.collection.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [long, lat]
                    },
                    $minDistance: 1,
                    $maxDistance: radius
                }
            }
        }).toArray();
    }

    /**
    * Returns points of interest which have tags matching at least one of the
    * querystring parameters
    */
    getMatchingPointsOfInterest(tags) {

        return this.collection.find({
            tags: {
                $in: tags
            }
        }).toArray();
    }
}

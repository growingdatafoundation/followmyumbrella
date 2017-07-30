'use strict';

const assert = require('assert');
const MongoDb = require('./mongoDb');
const ContributedStories = require('./contributedStories');


module.exports = class PointsOfInterestService {

    constructor(mongodbUrl) {

        assert(mongodbUrl !== undefined, 'mongodbUrl is a required argument');
        this.mongodb = new MongoDb(mongodbUrl);
        this.collectionName = 'pointOfInterests';
        this.contributedStories = new ContributedStories(mongodbUrl);
    }

    _getCollection() {

        return this.mongodb.getCollection(this.collectionName);
    }

    /**
     * Returns all points of interest
     */
    getPointsOfInterest() {

        return this._getCollection()
            .then(collection => collection.find().toArray());
    }

    /**
     * Returns a single point of interest
     */
    getPointOfInterest({id, extended = true}) {

        assert(id, 'id is a required argument');
        console.log('id', id);

        return this._getCollection()
            .then(collection => {

                const poi = collection.findOne({
                    _id: MongoDb.ObjectId(id)
                });

                let stories;
                if (extended) {
                    stories = this.contributedStories.getContributedStoriesForAPointOfInterest({
                        pointOfInterestId: id
                    });
                }

                return Promise.all([poi, stories])
            })
            .then(([pointOfInterest, stories]) => {

                pointOfInterest.stories = stories;
                return pointOfInterest;

                return [pointOfInterest, stories];
            })
    }

    /**
    * Returns points of interest near the location within the supplied radius
    */
    getNearbyPointsOfInterest({ long, lat, radius }) {

        return this._getCollection()
            .then(collection => collection.find({
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
            }).toArray());
    }

    /**
    * Returns points of interest which have tags matching at least one of the
    * querystring parameters
    */
    getMatchingPointsOfInterest({ tags }) {

        return this._getCollection()
            .then(collection => collection.find({
                tags: {
                    $in: tags
                }
            }).toArray());
    }
}

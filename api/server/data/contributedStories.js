'use strict';

const assert = require('assert');
const MongoDb = require('./mongoDb');


module.exports = class ContributedStoriesService {

    constructor(mongodbUrl) {

        assert(mongodbUrl !== undefined, 'mongodbUrl is a required argument');
        this.mongodb = new MongoDb(mongodbUrl);
        this.collectionName = 'stories';
    }

    _getCollection() {

        return this.mongodb.getCollection(this.collectionName);
    }

    /**
    * Returns all contributed stories
    */
    getContributedStories() {

        return this._getCollection()
            .then(collection => collection.find().toArray());
    }

    /**
    * Returns a single contributed story with the supplied id
    */
    getContributedStory({id}) {

        return this._getCollection()
            .then(collection => collection.findOne({
                _id: MongoDb.ObjectId(id)
            }));
    }

    /**
     * Gets the contributed stories for a point of interest.
     *
     * @param      {Object}  arg1                    The argument 1
     * @param      {<type>}  arg1.pointOfInterestId  The point of interest identifier
     * @return     {<type>}  The contributed story for a point of interest.
     */
    getContributedStoriesForAPointOfInterest({pointOfInterestId}) {

        return this._getCollection()
            .then(collection => collection.find({
                pointOfInterest: MongoDb.ObjectId(pointOfInterestId)
            }).toArray());
    }

    /**
    * Inserts a contributed story
    */
    putContributedStory(contribution) {

        return this._getCollection()
            .then(collection => collection.insertOne(contribution));
    }

    /**
    * Removes a single contributed story with the supplied id
    */
    deleteContributedStory({id}) {

        return this._getCollection()
            .then(collection => collection.deleteOne({
                _id: MongoDb.ObjectId(id)
            }));
    }
}

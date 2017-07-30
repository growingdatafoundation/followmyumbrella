'use strict';

const assert = require('assert');
const MongoDb = require('./mongoDb');;


module.exports = class ChallengeService {

  constructor(mongodbUrl) {

      assert(mongodbUrl !== undefined, 'mongodbUrl is a required argument');
      this.mongodb = new MongoDb(mongodbUrl);
      this.collectionName = 'challenges';
  }

  _getCollection() {

      return this.mongodb.getCollection(this.collectionName);
  }

  /**
   * Returns all contributed challenges
   */
  getChallenges() {

    return this._getCollection()
        .then(collection => collection.find().toArray());
  }

  /**
   * Returns a single challenge with the supplied id
   */
  getChallenge(id) {

    return this._getCollection()
        .then(collection => {
            collection.findOne({
              _id: ObjectId(id)
            });
        })
  }

  /**
   * Inserts a challenge
   */
  putChallenge(challenge) {

    return this._getCollection()
        .then(collection => {
            collection.insertOne(challenge);
        });
  }

  /**
   * Removes a single challenge with the supplied id
   */
  deleteChallenge(id) {
    return this._getCollection()
        .then(collection => {
            collection.deleteOne({
              _id: ObjectId(id)
            });
        });
  }

}

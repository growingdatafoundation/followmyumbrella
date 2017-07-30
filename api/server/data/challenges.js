'use strict';

const assert = require('assert');
const MongoDb = require('./mongoDb');



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
  getChallenge({id}) {

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
   * @return     {<type>}  The contributed challenge for a point of interest.
   */
  getChallengesForAPointOfInterest({pointOfInterestId}) {

      return this._getCollection()
          .then(collection => collection.find({
              pointOfInterest: MongoDb.ObjectId(pointOfInterestId)
          }).toArray());
  }

  /**
   * Inserts a challenge
   */
  putChallenge(challenge) {

    return this._getCollection()
        .then(collection => collection.insertOne(challenge)
        );
  }

  /**
   * Removes a single challenge with the supplied id
   */
  deleteChallenge({id, extended}) {
    return this._getCollection()
        .then(collection => collection.deleteOne({
            _id: MongoDb.ObjectId(id)
        }));
  }

}

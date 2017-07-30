'use strict';

const assert = require('assert');
const {
  ObjectId
} = require('mongodb');


module.exports = class ChallengeService {

  constructor(collection) {

    assert(collection !== undefined, 'Collection is a required argument');
    this.collection = collection;

  }

  /**
   * Returns all contributed challenges
   */
  getChallenges() {

    return this.collection.find().toArray();
  }

  /**
   * Returns a single challenge with the supplied id
   */
  getChallenge(id) {

    return this.collection.findOne({
      _id: ObjectId(id)
    });
  }

  /**
   * Inserts a challenge
   */
  putChallenge(challenge) {

    this.collection.insertOne(challenge)
  }

  /**
   * Removes a single challenge with the supplied id
   */
  deleteChallenge(id) {

    return this.collection.deleteOne({
      _id: ObjectId(id)
    });
  }

}

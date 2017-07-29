'use strict';

const assert = require('assert');
const {
  ObjectId
} = require('mongodb');


module.exports = class ContributedStoriesService {

  constructor(collection) {

    assert(collection !== undefined, 'Collection is a required argument');
    this.collection = collection;

  }

  /**
   * Returns all contributed stories
   */
  getContributedStories() {

    return this.collection.find().toArray();
  }

  /**
   * Returns a single contributed story with the supplied id
   */
  getContributedStory(id) {

    return this.collection.findOne({
      _id: ObjectId(id)
    });
  }

  /**
   * Inserts a contributed story
   */
  putContributedStory(contribution) {

    this.collection.insertOne(contribution)
  }

  /**
   * Removes a single contributed story with the supplied id
   */
  deleteContributedStory(id) {

    return this.collection.deleteOne({
      _id: ObjectId(id)
    });
  }

}

import {Tweets as TweetModel} from '../models'

export default {
  createTweet : async function (tweetObject) {
    await TweetModel.create(tweetObject);
    return this.findByAuthor(tweetObject.author);
  },

  findAll : function (){
    return TweetModel.find();
  },

  findById : function (tweetId) {
    return TweetModel.findById(tweetId);
  },

  findByAuthor : function (userId) {
    return TweetModel.where('author', userId).sort({date: 'desc'}).populate('author', 'username photo');
  }
}

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
  },

  like: async function (tweetId, userId) {
    let tweetObject = await this.findById(tweetId);
    let like = false;
    let dislike = false;

    if (tweetObject.dislikes.indexOf(userId) !== -1) {
      tweetObject.dislikes.remove(userId)
    }

    if (tweetObject.likes.indexOf(userId) == -1) {
      tweetObject.likes.push(userId);
      like = true;
    } else {
      tweetObject.likes.remove(userId)
    }

    await tweetObject.save();

    let likes = tweetObject.likes.length;
    let dislikes = tweetObject.dislikes.length;
    return { tweetId, like , dislike , likes , dislikes }
  },

  dislike: async function (tweetId, userId) {
    let tweetObject = await this.findById(tweetId);
    let dislike = false;
    let like = false;

    if (tweetObject.likes.indexOf(userId) !== -1) {
      tweetObject.likes.remove(userId)
    }

    if (tweetObject.dislikes.indexOf(userId) == -1) {
      tweetObject.dislikes.push(userId);
      dislike = true;
    } else {
      tweetObject.dislikes.remove(userId)
    }

    await tweetObject.save();

    let likes = tweetObject.likes.length;
    let dislikes = tweetObject.dislikes.length;
    return { tweetId, like , dislike , likes , dislikes }
  },

  getTweetsFromUsers : function (usersList) {
    return TweetModel.find({ 'author' : { $in : usersList }}).populate('author', 'username photo');
  }

}

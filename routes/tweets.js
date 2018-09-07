var express = require('express');
var router = express.Router();
import {handleError} from '../utils';
import {authenticate} from '../middleware';
import {Tweets} from '../db-api'

router.post('/', authenticate, async function(req, res) {
  let tweetObject = {
    text: req.body.text,
    author: req.auth.id,
  }
  try {
    let tweets = await Tweets.createTweet(tweetObject);
    res.status(200).send({
      success: true,
      tweets: tweets
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/like/:tweetId', authenticate, async function (req, res){
  try {
    let tweetId = req.params.tweetId;
    let userId = req.auth.id;
    let result = await Tweets.like(tweetId, userId);
    res.status(200).send({
      success: true,
      result: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/dislike/:tweetId', authenticate, async function (req, res){
  try {
    let tweetId = req.params.tweetId;
    let userId = req.auth.id;
    let result = await Tweets.dislike(tweetId, userId);
    res.status(200).send({
      success: true,
      result: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;

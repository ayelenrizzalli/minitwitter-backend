var express = require('express');
var router = express.Router();
import {handleError} from '../utils';
import {authenticate, getCurrentUser} from '../middleware';
import {Tweets} from '../db-api'
import {Users} from '../db-api'

router.get('/', authenticate, getCurrentUser, async function(req, res) {
  try {
    let feed = await Tweets.getFeed(req.user);
    res.status(200).send({
      success: true,
      feed: feed
    });
  } catch (error) {
    handleError(error, res);
  }
});


module.exports = router;

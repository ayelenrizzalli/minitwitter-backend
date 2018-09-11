var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
import {handleError} from '../utils';
import {checkEmailAndUsername, checkPassword, generateToken, prepareToken, sendToken, createUser, authenticate, getCurrentUser, verifyLogin} from '../middleware';
import {Users} from '../db-api'



router.get('/', async function(req, res) {
  try {
    let users = await Users.findAll();
    res.status(200).send({
      success: true,
      users: users
    });
  } catch (error) {
    handleError(error, res);
  }
})

router.post('/', async function(req, res) {
  let userObject = {
    name: req.body.name,
    lastName: req.body.lastName,
    birthDate: new Date(req.body.birthDate)
  }
  try {
    let user = await Users.createUser(userObject);
    res.status(200).send({
      success: true,
      user: user
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.get('/me', authenticate, getCurrentUser, async function(req, res){
  res.status(200).send({success:true, me: req.user});
});

router.get('/profile/:userId', authenticate, async function(req, res){
  let idProfile = req.params.userId;
  try {
    let user = await Users.findById(idProfile);
    res.status(200).send({
      success: true,
      user: user
    });
  } catch (error){
    handleError(error, res);
  }
});

router.post('/follow/:userId', authenticate, getCurrentUser, async function(req, res){
  let userFrom = req.user._id;
  let userTo = req.params.userId;
  try {
    let followersCount = await Users.addFollower(userFrom, userTo);
    res.status(200).send({
      success:true, followersCount:followersCount
    });
  } catch (error) {
    handleError(error,res);
  }
});

router.post('/unfollow/:userId', authenticate, getCurrentUser, async function(req, res){
  let userFrom = req.user._id;
  let userTo = req.params.userId;
  try {
    let followingCount = await Users.removeFollower(userFrom, userTo);
    res.status(200).send({
      success:true, followingCount:followingCount
    });
  } catch (error) {
    handleError(error,res);
  }
});

router.get('/followers', authenticate, getCurrentUser, async function(req, res){
  let usersId = req.user.followers;
  try {
    let followersList = await Users.getFollowers(usersId);
    res.status(200).send({
      success:true, followersList:followersList
    });
  } catch (error) {
    handleError(error,res);
  }
});

router.post('/photo', authenticate, getCurrentUser, async function(req, res){
  try {
    var form = new multiparty.Form();

    form.parse(req, async function(err, fields, files) {
      let photoUrl = await Users.addProfilePhoto(req.user._id, files.photo[0].path);
      res.status(200).send({
        success:true, photoUrl:photoUrl
      });
    });

  } catch (error) {
    handleError(error,res);
  }
});

router.post('/signup', checkEmailAndUsername, checkPassword, createUser, prepareToken, generateToken, sendToken);

router.post('/login', verifyLogin, prepareToken, generateToken, sendToken)

module.exports = router;

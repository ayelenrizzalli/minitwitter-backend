//Import JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const expressJwt = require('express-jwt');
import { handleError } from '../utils'
const {ObjectID} = require('mongodb');


//Import Model
import { Users } from '../db-api'




export const createToken = function(auth) {
    return jwt.sign(
        { id: auth.id },
        'mi-secreto',
        { expiresIn: 60 * 120 }
    );
};

export const generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
};

export const sendToken = async function (req, res) {
    res.setHeader('x-auth-token', req.token);
    try {
      let user = await Users.findById(req.user._id);
      res.status(200).send(user);
    } catch (error) {
      handleError(error,res);
    }
};

export const prepareToken = function (req, res, next) {
    // prepare token for API
    req.auth = {
        id: req.user.id
    };

    next();
};

//token handling middleware
export const authenticate = expressJwt({
    secret: 'mi-secreto',
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      }
      return null;
    }
});

// optional authentication
export const optionalAuth = expressJwt({
  secret: 'mi-secreto',
  requestProperty: 'auth',
  credentialsRequired: false,
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

export const getCurrentUser = async function(req, res, next) {
    try {
      var user = await Users.findById(req.auth.id);
      req.user = user;
      next();

    } catch (error) {
        handleError(error, res);
    }

};

export const getOne = function (req, res) {
    var user = req.user;
    res.json(user);
};

export const verifyLogin = async function (req, res, next) {
  let password = req.body.password;
  let email = req.body.email;
  try {

    let user = email ? await Users.findByEmail(String(email).toLowerCase()) : null;
    let error = false;
    let message = "";


    if (!user) {
      error = true;
      message = "User Not Found.";
    } else if (!password || !bcrypt.compareSync(password, user.password)) {
      error = true;
      message = "Wrong Password.";
    }

    if (error) {
      res.status(401).send({success:false, message:message});
      return;
    }

    req.user = user;
    next();

  } catch (error) {
    handleError(error,res);
  }

};

export const createUser = async function (req, res, next) {
  let password = req.body.password;
  let hash = bcrypt.hashSync(password, 10);

  try {

    let id = new ObjectID();

    let userData = {
      _id: id,
      name : req.body.name ? req.body.name : " ",
      lastName : req.body.lastName ? req.body.lastName : " ",
      birthDate : new Date(req.body.birthDate),
      email : req.body.email,
      password : hash,
      username: req.body.username
    };

    let user = await Users.createUser(userData);

    req.user = user;

    next();

  } catch (error) {
    handleError(error,res);
  }
};

export const checkEmailAndUsername = async function (req, res, next) {
  let email = String(req.body.email).toLowerCase();
  let username = String(req.body.username).toLowerCase();

  if (!req.body.email) {
    res.status(409).send({success:false, message:"E-Mail is missing."});
    return;
  }

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    res.status(409).send({success:false, message:"Your email address is not valid."});
    return;
  }

  if (!req.body.username) {
    res.status(409).send({success:false, message: "Missing username"});
    return;
  }

  try {
    let other = await Users.findByEmail(email);
    if (other) {
      res.status(409).send({success:false, message:"Your email address is already in use."});
      return;
    }

    other = await Users.findByUsername(username);
    if (other) {
      res.status(409).send({success:false, message:"Your username is already in use."});
      return;
    }

    req.body.email = email;
    req.body.username = username;

    next();
  } catch (error) {
    handleError(error,res);
  }
};

export const checkPassword = async function (req, res, next) {
  if (!req.body.password) {
    res.status(409).send({success:false, message:"Password is missing."});
    return;
  }
  if (req.body.password.length < 6 || req.body.password.length > 30) {
    res.status(409).send({success:false, message:"Password must be of minimum 6 characters length (Max 30)"});
    return;
  }

  next();
}

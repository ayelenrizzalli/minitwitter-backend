var express = require('express');
var router = express.Router();
import {handleError} from '../utils';
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

module.exports = router;

import {Users as UserModel} from '../models'

var fs = require('fs');
var cloudinary = require('cloudinary').v2;

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default {
  createUser : function (userObject) {
    return UserModel.create(userObject);
  },

  findAll : function (){
    return UserModel.find();
  },

  findById : function (userId) {
    return UserModel.findById(userId);
  },

  findByEmail: function (userEmail) {
    return UserModel.findOne({email: userEmail});
  },

  findByUsername : function (username) {
    return UserModel.findOne({username: username});
  },

//return the number of followers from UserTo
  addFollower : async function (userFromId, userToId) {
    let userFromObject = await this.findById(userFromId);
    let userToObject = await this.findById(userToId);
    if (userToObject.followers.indexOf(userFromId) == -1){
      userFromObject.following.push(userToId);
      userToObject.followers.push(userFromId);
      await userFromObject.save();
      await userToObject.save();
    }
    return userToObject.followers.length;
  },

  removeFollower : async function (userFromId, userToId) {
    let userFromObject = await this.findById(userFromId);
    let userToObject = await this.findById(userToId);
    if (userToObject.followers.indexOf(userFromId) != -1){
      userFromObject.following.remove(userToId);
      userToObject.followers.remove(userFromId);
      await userFromObject.save();
      await userToObject.save();
    }
    return userToObject.following.length;
  },

  addProfilePhoto : async function (userId, path) {
    let photo = await cloudinary.uploader.upload(path, function(error, result) {console.log(result, error)});
    let userObject = await this.findById(userId);
    userObject.photo = photo.url;
    await userObject.save();
    return photo.url;
  }



}

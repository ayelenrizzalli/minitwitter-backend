import {Users as UserModel} from '../models'

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
  }
}

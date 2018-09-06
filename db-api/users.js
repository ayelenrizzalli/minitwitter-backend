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
  }
}

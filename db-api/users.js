import {Users as UsersModel} from '../models'

export default {
  createUser : function (userObject) {
    return UsersModel.create(userObject);
  },

  findAll : function (){
    return UsersModel.find();
  }
}

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    birthDate: {type: Date, required: true},
    photo: {type: String},
    bio: {type: String},
    username: {type: String},
    password: {type: String},
    email: {type: String},
    following: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'Users'}]
});

module.exports = mongoose.model('User', UserSchema);

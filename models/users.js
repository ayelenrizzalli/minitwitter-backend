var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    birthDate: {type: Date, required: true}
});

module.exports = mongoose.model('User', UserSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true, default: Date.now},
    photo: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Tweet', TweetSchema);

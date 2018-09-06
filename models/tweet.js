var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
    date: {type: Date, required: true, default: Date.now},
    photo: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    dislikes: [{type: Schema.Types.ObjectId, ref: 'Users'}]
});

module.exports = mongoose.model('Tweet', TweetSchema);

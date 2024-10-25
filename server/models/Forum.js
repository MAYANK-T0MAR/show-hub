const mongoose = require('mongoose');


const ReplySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timestamp: { type: Date, default: Date.now },
    replies: [this]
});

// Comment Schema
const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs who liked the comment
    timestamp: { type: Date, default: Date.now },
    replies: [ReplySchema]
});

// Category Schema
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    showId: { type: String, default: null }  // Optional, set to null if not related to a show
});

// Forum Schema
const ForumSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs who liked the forum post
    timestamp: { type: Date, default: Date.now },
    comments: [CommentSchema],  // Embedded comments schema
    category: [CategorySchema],     // Embedded category schema
    views: { type: Number, default: 0 } 
});

const Forum = mongoose.model('Forum', ForumSchema);

module.exports = Forum;

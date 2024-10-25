const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
    showId: { type: Number, required: true },
    title : { type: String },
    poster : { type : String },
    banner : { type : String },
    score: { type: Number },
    progress: { type: String },
    startDate: { type: String },
    finishDate: { type: String },
    notes: { type: String },
    private: { type: Boolean, default: false }
});

const ListSchema = new mongoose.Schema({
    listName: { type: String, required: true },
    shows: [ShowSchema],
    private: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    banner: { type: String },
    pfp: { type: String },
    userLists: { type: [ListSchema], default: [] } 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

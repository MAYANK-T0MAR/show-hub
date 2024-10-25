const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    showId: { 
        type: Number, 
        required: true 
    },
    showTitle: { 
        type: String, 
        required: true 
    },
    showBanner: { 
        type: String 
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: [] 
    }],
    dislikes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: []  
    }],
    reviewSummary: { 
        type: String, 
        required: true 
    },
    reviewText: { 
        type: String, 
        required: true 
    },
    score: { 
        type: Number, 
        min: 0, 
        max: 100, 
        required: true 
    },
    private: { 
        type: Boolean, 
        default: false 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});


const Review = mongoose.model('Review', ReviewSchema);

// Export the model
module.exports = Review;

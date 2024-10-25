require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Review = require('./models/Review');
const Forum = require('./models/Forum');
const app = express();

app.use(cors());

//Accessing Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Middleware to parse JSON
app.use(express.json());


// Route to check if username is available
app.post('/check-username', async (req, res) => {
  const { value: username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.json({ available: false });
  }
  res.json({ available: true });
});

// Route to check if email is available
app.post('/check-email', async (req, res) => {
  const { value: email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ available: false });
  }
  res.json({ available: true });
});







// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(" ")[1];

//     try {
//       const verified = jwt.verify(token, JWT_SECRET);
//       req.userId = verified.userId; // Attach userId to the request object
//     } catch (err) {
//       console.log("Invalid or expired token");
//     }
//   }

//   next(); // Proceed to the route handler even if there's no token
// };

// app.get('/user/:userId', verifyToken, async (req, res) => {
//   try {
//     const profileUserId = req.params.userId;
//     const profileData = await User.findById(profileUserId);

//     if (!profileData) return res.status(404).send("User not found");

//     // This is to determine if the visitor is the profile owner
//     const isOwner = req.userId && req.userId === profileUserId;

//     res.status(200).json({ profileData, isOwner });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });




// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.userId = verified.userId; // Attach userId to the request object
    } catch (err) {
      console.log("Invalid or expired token");
    }
  } else {
    return res.status(401).json({ message: 'Authorization token missing' });  // Return if no auth header
  }

  next(); // Proceed to the route handler even if there's no token
};

// Route to get user profile by username
// app.get('/user/:username', verifyToken, async (req, res) => {
//   try {
//     const profileUsername = req.params.username;
//     const profileData = await User.findOne({ username: profileUsername });

//     if (!profileData) return res.status(404).send("User not found");

//     // This is to determine if the visitor is the profile owner
//     const isOwner = req.userId && req.userId === profileData._id.toString();

//     res.status(200).json({ profileData, isOwner });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });



app.get('/user/:username', verifyToken, async (req, res) => {
  try {
    const profileUsername = req.params.username;

    // Find the user by username and exclude the password field
    const profileData = await User.findOne({ username: profileUsername }).select('-password');

    if (!profileData) return res.status(404).send("User not found");

    // This is to determine if the visitor is the profile owner
    const isOwner = req.userId && req.userId === profileData._id.toString();

    // Filter the userLists based on whether the user is the owner
    let filteredLists = profileData.userLists;
    if (!isOwner) {
      filteredLists = filteredLists.filter(list => !list.private);
    }

    // Send back the profile data, excluding the password and applying the list filter
    res.status(200).json({
      username: profileData.username,
      email: profileData.email,
      banner: profileData.banner,
      pfp: profileData.pfp,
      userLists: filteredLists,
      isOwner
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});






app.post('/refresh-token', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const newToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).send({ token: newToken });
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});




// Route to create a new user
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultLists = [
      { listName: 'Plan to Watch', shows: [], private: false },
      { listName: 'Watching', shows: [], private: false },
      { listName: 'Completed', shows: [], private: false }
    ];

    const user = new User({
      username,
      email,
      password: hashedPassword,
      userLists: defaultLists, // Initializes userLists as an empty array
      banner: "https://i.pinimg.com/564x/4d/a6/33/4da633c24cb366a00db871230247494e.jpg",
      pfp: "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png"
    });
    await user.save();
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).send({ token, userId: user._id, username: user.username });

    // res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});




app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    // Send response
    res.status(200).send({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});






app.get('/search-users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Search for users with a username that matches the search term, case-insensitive
    const matchingUsers = await User.find({
      username: { $regex: username, $options: 'i' } // 'i' makes it case-insensitive
    }).select('username pfp'); // Select only the username and pfp fields

    if (matchingUsers.length === 0) {
      return res.status(404).json({ message: 'No users found matching the search criteria' });
    }

    // Return the list of matching users
    res.status(200).json(matchingUsers);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});








app.post('/add-show', verifyToken, async (req, res) => {
  const {
    showId,
    title,
    poster,
    banner,
    listname,
    creatingNewList,
    newList,
    score,
    progress,
    startDate,
    finishDate,
    listIsPrivate,
    entryIsPrivate,
    notes
  } = req.body;

  try {
    const user = await User.findById(req.userId); // Use userId from the token

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Utility function to check if a list is a default one
    function isDefaultList(listName) {
      const defaultLists = ["Plan to Watch", "Watching", "Completed"];
      return defaultLists.includes(listName);
    }
    console.log(`Received list name is : ${listname}, which is custom ? : ${!isDefaultList(listname)}`);

    // Function to create a new show entry
    function createNewShowEntry({ showId, title, poster, banner, score, progress, startDate, finishDate, entryIsPrivate, notes }) {
      return { showId, title, poster, banner, score, progress, startDate, finishDate, private: entryIsPrivate, notes };
    }

    // Function to update an existing show entry
    function updateShowEntry(show, { score, progress, startDate, finishDate, entryIsPrivate, notes }) {
      show.score = score;
      show.progress = progress;
      show.startDate = startDate;
      show.finishDate = finishDate;
      show.private = entryIsPrivate;
      show.notes = notes;
    }

    // Step 1: Check if showId exists in any default list
    // let currentDefaultList = user.userLists.find(list => 
    //   isDefaultList(list.listName) && list.shows.some(show => show.showId === showId)
    // );

    let currentDefaultList = user.userLists.find(list => {
      const isDefault = isDefaultList(list.listName);
      const containsShow = list.shows.some(show => Number(show.showId) === Number(showId));
      return isDefault && containsShow;
    });




    // Case 1: ShowId is in a default list, and the request is for another default list
    if (currentDefaultList && isDefaultList(listname)) {
      if (currentDefaultList.listName === listname) {
        // Modify the entry in the current default list
        let show = currentDefaultList.shows.find(show => Number(show.showId) === Number(showId));
        updateShowEntry(show, { score, progress, startDate, finishDate, entryIsPrivate, notes });
        currentDefaultList.private = listIsPrivate;
      } else {
        // Move the entry from the current default list to the new default list
        currentDefaultList.shows = currentDefaultList.shows.filter(show => Number(show.showId) !== Number(showId));


        let newDefaultList = user.userLists.find(list => list.listName === listname);
        if (newDefaultList) {
          newDefaultList.shows.push(createNewShowEntry(req.body));
          newDefaultList.private = listIsPrivate;
        }
      }
    }

    // Case 2: ShowId is in a default list but the request is for a custom list
    else if (currentDefaultList && !isDefaultList(listname)) {

      let customList = user.userLists.find(list => list.listName === listname);

      if (customList) {
        let show = customList.shows.find(show => Number(show.showId) === Number(showId));
        if (show) {
          // Modify the entry in the custom list
          updateShowEntry(show, { score, progress, startDate, finishDate, entryIsPrivate, notes });
          customList.private = listIsPrivate;
        } else {
          // Add the entry to the custom list
          customList.shows.push(createNewShowEntry(req.body));
          customList.private = listIsPrivate;
        }
      } else if (creatingNewList) {

        // Create a new custom list and add the show entry
        let newCustomList = {
          listName: newList,
          shows: [createNewShowEntry(req.body)],
          private: listIsPrivate
        };

        user.userLists.push(newCustomList);
      }
    }

    // Case 3: ShowId is not in any default list, and the request is for a default list
    else if (!currentDefaultList && isDefaultList(listname)) {
      let targetDefaultList = user.userLists.find(list => list.listName === listname);
      if (targetDefaultList) {
        targetDefaultList.shows.push(createNewShowEntry(req.body));
        targetDefaultList.private = listIsPrivate;
      }
    }

    // Case 4: ShowId is not in any default list, and the request is for a custom list
    else if (!currentDefaultList && !isDefaultList(listname)) {
      let customList = user.userLists.find(list => list.listName === listname);
      if (customList) {
        let show = customList.shows.find(show => Number(show.showId) === Number(showId));
        if (show) {
          // Modify the entry in the custom list
          updateShowEntry(show, { score, progress, startDate, finishDate, entryIsPrivate, notes });
          customList.private = listIsPrivate;
        } else {
          // Add the entry to the custom list
          customList.shows.push(createNewShowEntry(req.body));
          customList.private = listIsPrivate;
        }
      } else if (creatingNewList) {
        // Create a new custom list and add the show entry
        let newCustomList = {
          listName: newList,
          shows: [createNewShowEntry(req.body)],
          private: listIsPrivate
        };
        user.userLists.push(newCustomList);
      }
    }

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});







app.delete('/remove-show/:listName/:showId', verifyToken, async (req, res) => {
  try {
    const { listName, showId } = req.params;
    const userId = req.userId; // User ID is attached by the verifyToken middleware

    // Find the user by their ID and the specific list by listName
    const user = await User.findOne({ _id: userId, 'userLists.listName': listName });

    if (!user) {
      return res.status(404).json({ message: 'User or list not found' });
    }

    // Find the correct list and remove the show from the shows array
    const list = user.userLists.find(list => list.listName === listName);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Filter out the show by showId
    list.shows = list.shows.filter(show => show.showId !== parseInt(showId));

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: 'Show removed successfully', userLists: user.userLists });
  } catch (error) {
    console.error('Error removing show:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});




// app.get('/show-lookup/:showId', verifyToken, async (req, res) => {
//   const { showId } = req.params;


//   function isDefaultList(listName) {
//     const defaultLists = ["Plan to Watch", "Watching", "Completed"];
//     return defaultLists.includes(listName);
//   }

//   try {
//     // Find the user by the userId obtained from the token
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     // Loop through the user's lists to find the show by its showId
//     let foundShow = null;
//     let foundList = null;
//     let otherLists = [];

//     // Check each list for the show
//     for (let list of user.userLists) {
//       const showEntry = list.shows.find(show => Number(show.showId) === Number(showId));
//       if (showEntry) {
//         foundShow = showEntry;

//         if (isDefaultList(list.listName)) {
//           // If the list is one of the default lists, store it in defaultList
//           foundList = list;
//         } else {
//           // If the list is a custom list, add it to the otherLists array
//           otherLists.push(list);
//         }
//       }
//     }

//     if (!foundShow || !foundList) {
//       return res.status(404).send('Show not found');
//     }

//     // Return show data along with the list it was found in
//     res.status(200).json({
//       listName: foundList? foundList.listName : null,
//       otherLists : otherLists,
//       score: foundShow.score,
//       progress: foundShow.progress,
//       startDate: foundShow.startDate,
//       finishDate: foundShow.finishDate,
//       notes: foundShow.notes,
//       listIsPrivate: foundList.private,
//       entryIsPrivate: foundShow.private,
//     });

//   } catch (error) {
//     console.error('Error in show-lookup:', error);
//     res.status(500).send('Internal server error');
//   }
// });



app.get('/show-lookup/:showId', verifyToken, async (req, res) => {
  const { showId } = req.params;

  function isDefaultList(listName) {
    const defaultLists = ["Plan to Watch", "Watching", "Completed"];
    return defaultLists.includes(listName);
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    let defaultListData = null;
    let otherLists = [];

    // Loop through the user's lists to find the show by its showId
    for (let list of user.userLists) {
      const showEntry = list.shows.find(show => Number(show.showId) === Number(showId));

      if (showEntry) {
        if (isDefaultList(list.listName)) {
          // If the show is in a default list, store the default list data
          defaultListData = {
            listName: list.listName,
            showData: showEntry,
            private: list.private,
          };
        } else {
          // For custom lists, store the data in otherLists
          otherLists.push({
            listName: list.listName,
            showData: showEntry,
            private: list.private,
          });
        }
      }
    }

    // If the show is not found in any list, return a 404 error
    if (!defaultListData && otherLists.length === 0) {
      return res.status(404).send('Show not found');
    }

    // Send the response with the found data
    res.status(200).json({
      defaultListData,
      otherLists,
    });

  } catch (error) {
    console.error('Error in show-lookup:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/list-lookup', verifyToken, async (req, res) => {
  try {
    // Find the user by the ID obtained from the token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Helper function to check if a list is a default list
    function isDefaultList(listName) {
      const defaultLists = ["Plan to Watch", "Watching", "Completed"];
      return defaultLists.includes(listName);
    }

    // Collect all custom list names (non-default lists)
    let availableLists = user.userLists
      .filter(item => !isDefaultList(item.listName))
      .map(item => ({
        listName: item.listName,
        private: item.private
      }));

    // Return the available custom list names
    res.status(200).json(availableLists);

  } catch (error) {
    console.error('Error fetching available lists:', error);
    res.status(500).send('Internal server error');
  }
});



app.post('/post-review', verifyToken, async (req, res) => {
  try {
    // Check if userId exists from the token verification
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized, token invalid or missing' });
    }

    // Fetch user details from the 'users' collection using userId
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Destructure the review data from the request body
    const {
      showId,
      showTitle,
      showBanner,
      reviewSummary,
      reviewText,
      score,
      private: isPrivate
    } = req.body;

    // Create a new review object
    const newReview = new Review({
      userId: user._id,
      showId,
      showTitle,
      showBanner,
      reviewSummary,
      reviewText,
      score,
      private: isPrivate,
      likes: [],
      dislikes: [],
      timestamp: new Date() // Server-side timestamp generation
    });

    // Save the review in the database
    await newReview.save();

    // Respond with a success message
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});


app.get('/reviews/:showId', async (req, res) => {
  try {
    const { showId } = req.params;

    // Fetch reviews that match the given showId
    let reviews = await Review.find({ showId });

    // Filter out private reviews
    reviews = reviews.filter(review => !review.private);

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this show' });
    }

    // Array to store enriched review data
    const enrichedReviews = [];

    // Loop through reviews to fetch user details and combine data
    for (const review of reviews) {
      const user = await User.findById(review.userId);

      if (user) {
        enrichedReviews.push({
          _id: review._id,
          userId: review.userId, // From reviews collection
          showId: review.showId, // From reviews collection
          showTitle: review.showTitle, // From reviews collection
          showBanner: review.showBanner, // From reviews collection
          username: user.username, // From users collection
          userPfp: user.pfp, // From users collection
          likes: review.likes.length, // From reviews collection
          dislikes: review.dislikes.length, // From reviews collection
          reviewSummary: review.reviewSummary, // From reviews collection
          reviewText: review.reviewText, // From reviews collection
          score: review.score, // From reviews collection
          private: review.private, // From reviews collection
          timestamp: review.timestamp // From reviews collection
        });
      }
    }

    // Return the enriched list of reviews
    res.status(200).json(enrichedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});


app.get('/review/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Fetch the review by its _id
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Fetch the user who wrote the review
    const user = await User.findById(review.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the review is private and if the requesting user is not the owner
    if (review.private && req.userId !== String(review.userId)) {
      return res.status(403).json({ message: 'Access denied: This review is private' });
    }

    let userInteraction = null;
    if (review.likes.some(id => id.toString() === req.userId)) {
      userInteraction = 'liked';
    } else if (review.dislikes.some(id => id.toString() === req.userId)) {
      userInteraction = 'disliked';
    }

    // Prepare enriched data with user and review info
    const enrichedReview = {
      userId: review.userId, // From reviews collection
      showId: review.showId, // From reviews collection
      showTitle: review.showTitle, // From reviews collection
      showBanner: review.showBanner, // From reviews collection
      username: user.username, // From users collection
      userPfp: user.pfp, // From users collection
      likes: review.likes.length, // From reviews collection
      dislikes: review.dislikes.length, // From reviews collection
      reviewSummary: review.reviewSummary, // From reviews collection
      reviewText: review.reviewText, // From reviews collection
      score: review.score, // From reviews collection
      private: review.private, // From reviews collection
      timestamp: review.timestamp, // From reviews collection
      status: userInteraction
    };

    // Send the enriched review data
    res.status(200).json(enrichedReview);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});


app.get('/:username/user-reviews', verifyToken, async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all reviews for the found user
    let reviews = await Review.find({ userId: user._id });

    // Check if the user requesting the data is the owner of the reviews
    if (req.userId !== String(user._id)) {
      // Filter out private reviews if the user is not the owner
      reviews = reviews.filter(review => !review.private);
    }

    // Send the reviews (filtered or all depending on ownership)
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});




app.post('/review/:reviewId/like', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!req.userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the review by its ID
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user has already liked the review by comparing strings
    if (review.likes.some(id => id.toString() === req.userId)) {
      // If the user already liked it, remove them from the likes array (toggle off)
      review.likes = review.likes.filter(id => id.toString() !== req.userId);
    } else {
      // Otherwise, add the userId to the likes array
      review.likes.push(req.userId);

      // Also remove the userId from dislikes if present
      review.dislikes = review.dislikes.filter(id => id.toString() !== req.userId);
    }

    await review.save();
    return res.status(200).json({ message: 'Review like status updated', review });
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});




app.post('/review/:reviewId/dislike', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!req.userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the review by its ID
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user has already disliked the review by comparing strings
    if (review.dislikes.some(id => id.toString() === req.userId)) {
      // If the user already disliked it, remove them from the dislikes array (toggle off)
      review.dislikes = review.dislikes.filter(id => id.toString() !== req.userId);
    } else {
      // Otherwise, add the userId to the dislikes array
      review.dislikes.push(req.userId);

      // Also remove the userId from likes if present
      review.likes = review.likes.filter(id => id.toString() !== req.userId);
    }

    await review.save();
    return res.status(200).json({ message: 'Review dislike status updated', review });
  } catch (error) {
    console.error('Error disliking review:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});



app.post('/post-forum', verifyToken, async (req, res) => {
  try {
    const { title, description, catagory } = req.body;


    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid User Id' });
    }

    // Create new forum
    const forum = new Forum({
      userId: user._id,
      title: title,
      description: description,
      likes: [],  // Initialize likes as an empty array
      timestamp: Date.now(),  // Store current timestamp
      comments: [],  // Initialize comments as an empty array
      category: catagory
    });


    await forum.save();


    res.status(200).json({ message: 'Forum posted successfully', forum });

  } catch (error) {

    res.status(500).json({ message: 'Internal Server Error', error });
  }
});







// app.get('/forums/show/:showId', async (req, res) => {
//   try {
//     const { showId } = req.params;  // Extract showId from useParams


//     // Find forums where category array has an object with matching showId
//     const forums = await Forum.find({
//       'category.showId': showId  // Look for forums with matching showId in the category array
//     });

//     // Check if any forums were found
//     if (forums.length === 0) {
//       return res.status(404).json({ message: 'No forums found for this show' });
//     }

//     // Return the forums that match the showId
//     res.status(200).json(forums);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error', error });
//   }
// });

app.get('/forums/show/:showId', async (req, res) => {
  try {
    const { showId } = req.params;  // Extract showId from params

    // Find forums where category array has an object with matching showId
    const forums = await Forum.find({
      'category.showId': showId  // Look for forums with matching showId in the category array
    })
      .populate({
        path: 'userId',  // Populate forum creator
        select: 'username pfp'
      })
      .populate({
        path: 'comments.userId',  // Populate comment authors for the last reply check
        select: 'username pfp'
      });


    // Check if any forums were found
    if (forums.length === 0) {
      return res.status(404).json({ message: 'No forums found for this show' });
    }

    // Map over the forums to return the desired abstract data
    const abstractForums = forums.map(forum => {
      // const replyCount = forum.comments.reduce((acc, comment) => acc + (comment.replies ? comment.replies.length : 0), 0);
      const replyCount = forum.comments?.length || 0;

      // Find the last comment or last reply (i.e., the latest activity)
      const allCommentsAndReplies = [...forum.comments];  // Start with top-level comments
      forum.comments.forEach(comment => {
        allCommentsAndReplies.push(...comment.replies);  // Add replies to the list
      });

      // Sort by timestamp to find the latest activity
      const lastActivity = allCommentsAndReplies.sort((a, b) => b.timestamp - a.timestamp)[0] || null;

      // Extract last activity user info if there is any activity
      const lastActivityData = lastActivity ? {
        userId: lastActivity.userId._id,
        username: lastActivity.userId.username,
        userPfp: lastActivity.userId.pfp,
        timestamp: lastActivity.timestamp
      } : null;


      return {
        _id: forum._id,
        userId: forum.userId._id,
        username: forum.userId.username,
        userPfp: forum.userId.pfp,
        title: forum.title,
        views: forum.views,
        replies: replyCount,  // Number of replies
        categories: forum.category,
        lastRecentActivity: lastActivityData  // Data about the last reply or null
      };
    });

    // Return the abstracted forum data
    res.status(200).json(abstractForums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});




const populateRepliesRecursively = async (replies) => {
  for (const reply of replies) {
    reply.userId = await User.findById(reply.userId, 'username pfp'); // Manually populate the userId
    if (reply.replies && reply.replies.length > 0) {
      await populateRepliesRecursively(reply.replies); // Populate nested replies
    }
  }
};

app.get('/forum/:forumId', async (req, res) => {
  try {
    const { forumId } = req.params;

    // Use lean() to get a plain JavaScript object instead of a Mongoose document
    const forumData = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { views: 1 } }, // Increment views count
      { new: true }
    )
      .lean()
      .populate({
        path: 'userId',
        select: 'username pfp'
      })
      .populate({
        path: 'comments.userId',
        select: 'username pfp'
      });

    if (!forumData) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Manually populate nested replies
    for (const comment of forumData.comments) {
      await populateRepliesRecursively(comment.replies);
    }

    res.status(200).json(forumData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});






// app.get('/forum/:forumId', async (req, res) => {
//   try {
//     const { forumId } = req.params;

//     const forumData = await Forum.findByIdAndUpdate(
//       forumId,
//       { $inc: { views: 1 } },  // Increment the views count by 1
//       { new: true }            // Return the updated document after increment
//     )
//       .populate({
//         path: 'userId', // Populate the forum creator
//         select: 'username pfp'
//       })
//       .populate({
//         path: 'comments.userId', // Populate the comment authors
//         select: 'username pfp'
//       })
//       .populate({
//         path: 'comments.replies.userId', // Populate the reply authors within the comments
//         select: 'username pfp'
//       });

//     if (!forumData) {
//       return res.status(404).json({ message: 'Forum not found' });
//     }


//     // Return the populated forum data
//     res.status(200).json(forumData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




app.post('/post-comment/:forumId', verifyToken, async (req, res) => {
  try {
    const { forumId } = req.params;
    const { text } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    // Find the forum by forumId
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Create new comment
    const newComment = {
      userId: req.userId,
      text: text,
      likes: [],
      timestamp: Date.now(),
      replies: []  // Initial replies array
    };

    // Push the new comment to the comments array
    forum.comments.push(newComment);

    // Save the forum document with the new comment
    await forum.save();

    res.status(200).json({ message: 'Comment posted successfully', forum });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});



app.post('/forum/like/:forumId', verifyToken, async (req, res) => {
  try {
    const { forumId } = useParams();

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    if (forum.likes.some(id => id.toString() === req.userId)) {
      forum.likes = forum.likes.filter(id => id.toString() !== req.userId);
    } else {
      forum.likes.push(req.userId);
    }

    await forum.save();
    return res.status(200).json({ message: 'forum like status updated', forum });
  } catch (error) {
    console.error('Error liking forum:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
})





app.post('/post-reply/:forumId/:commentId', verifyToken, async (req, res) => {
  try {
    const { forumId, commentId } = req.params;
    const { text } = req.body;

    // Find the forum by forumId
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Find the comment by commentId within the forum's comments array
    const comment = forum.comments.id(commentId);
    // console.log("comment found for the reply : ", comment);


    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Create a new reply
    const newReply = {
      userId: req.userId,
      text: text,
      likes: [],
      timestamp: Date.now(),
      replies: []  // Initial replies array for nested replies
    };

    // Push the reply to the replies array of the comment
    comment.replies.push(newReply);

    // Save the forum document with the updated comment
    await forum.save();

    res.status(200).json({ message: 'Reply posted successfully', forum });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});
















app.post('/reply-to-reply/:forumId/:replyId', verifyToken, async (req, res) => {

  try {
    const { forumId, replyId } = req.params;
    const { text } = req.body;

    console.log("id found : ", replyId);

    // Find the forum by forumId
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Find the comment that contains the reply by replyId within the forum's comments
    let targetReply = null;
    let parentComment = null;

    // Iterate through comments to find the reply
    forum.comments.forEach(comment => {
      comment.replies.forEach(reply => {
        if (reply._id.equals(replyId)) {
          targetReply = reply;
          parentComment = comment;
        }
      });
    });

    if (!targetReply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Create a new nested reply
    const newReply = {
      userId: req.userId,
      text: text,
      likes: [],
      timestamp: Date.now(),
      replies: [] // Initial replies array for nested replies
    };

    // Push the new reply to the replies array of the found reply
    targetReply.replies.push(newReply);

    // Save the forum document with the updated replies
    await forum.save();

    res.status(200).json({ message: 'Reply posted successfully', forum });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});






// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

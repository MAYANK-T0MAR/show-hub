// import '../src/css/App.css';
// import Content from './components/Content';
// import Header from './components/Header';
// import Welcome from './components/Welcome';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import MovieDetails from './pages/MovieDetails';
import AllEpisode from './pages/AllEpisode';
import Person from './pages/Person';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import { useEffect } from 'react';
import UserLists from './pages/UserLists';
import UserReviews from './pages/UserReviews';
import UserFollowers from './pages/UserFollowers';
import UserFollowing from './pages/UserFollowing';
import UserForumThread from './pages/UserForumThread';
import UserForumComments from './pages/UserForumComments';
import Review from './pages/Review';
import ReviewEditor from './pages/ReviewEditor';
import ForumEditor from './pages/ForumEditor';
import ForumThread from './pages/ForumThread';


function App() {



  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:id/details' element={<MovieDetails />} />
        <Route path='/:id/AllEpisodes' element={<AllEpisode />} />
        <Route path='/person/:id' element={<Person />} />
        <Route path='/user/:username' element={<UserProfile />} />
        <Route path='/user/:username/lists' element={<UserLists />} />
        <Route path='/user/:username/reviews' element={<UserReviews />} />
        <Route path='/user/:username/followers' element={<UserFollowers />} />
        <Route path='/user/:username/following' element={<UserFollowing />} />
        <Route path='/user/:username/forum-threads' element={<UserForumThread />} />
        <Route path='/user/:username/forum-comments' element={<UserForumComments />} />
        <Route path='/review/editor/:id' element={<ReviewEditor />} />
        <Route path='/review/:id' element={<Review />} />
        <Route path='/forum/editor/:id?' element={<ForumEditor />} />
        <Route path='/forum/thread/:id?' element={<ForumThread />} />
      </Routes>
    </Router>
  );
}

export default App;

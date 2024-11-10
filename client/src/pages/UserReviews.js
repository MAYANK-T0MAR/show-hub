import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../css/user-css/UserReviews.css";
import Header from '../components/Header';
import UserProfileHeader from '../components/user-components/UserProfileHeader';
import axios from 'axios';
import { DbContext } from '../context/DbContext';


function UserReviews() {

  const { username } = useParams();
  document.title = `${username || ''}'s reviews - ShowHub`;
  const { token } = useContext(DbContext);
  
  const [userReviewsData, setUserReviewsData] = useState(null);

  const getUserReviewsData = async (username) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/${username}/user-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Reviews:', response.data);
      setUserReviewsData(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    getUserReviewsData(username);
  }, [username])


  return (
    <div className='user-reviews'>
      <Header onPage={true} />
      <UserProfileHeader currentPage={"Reviews"}/>
      <div className="user-reviews-content-container">
        <div className="user-reviews-container">


          {userReviewsData && userReviewsData.length > 0
            ?
            userReviewsData.map(item => (
              <Link to={`/review/${item?._id}`}>
                <div className="ur-card">
                  <div className="ur-card-header" style={item?.showBanner ? {backgroundImage : `url(${item?.showBanner})`} : {backgroundColor: 'gray'}}>
                    <div className="urc-read-overlay">
                      Read Full Review
                    </div>
                  </div>
                  <div className="ur-card-content">
                    <span className="urc-content-title">Review of {item?.showTitle} by {username || ""}</span>
                    <span className='urc-content-text'>{item?.reviewSummary}</span>
                    <div className="urc-content-likes">
                      <i className="bi bi-hand-thumbs-up-fill"></i>
                      <span className='urc-content-like-count'>{item?.likes?.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
            : "No reviews found"
          }







        </div>
      </div>
    </div>
  )
}

export default UserReviews
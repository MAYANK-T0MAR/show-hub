import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "../css/SocialPosts.css"
import axios from 'axios';
import { DbContext } from '../context/DbContext';

function SocialPosts() {
    const { id } = useParams();

    const { categoryColors, convertTimestampToRelativeTime } = useContext(DbContext);
    const [reviews, setReviews] = useState(null);
    const [forums, setForums] = useState(null);

    const getReviews = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
            console.log('Reviews:', response.data);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };


    const getForums = async () => {
        try {
            console.log(`id received : ${id}`);

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/forums/show/${id}`);
            setForums(response.data);
        } catch (error) {
            console.error('error fetching forums:', error)
        }
    }

    useEffect(() => {
        getReviews(id);
        getForums();
    }, [id]);

    useEffect(() => {
      console.log("forums on social post : ", forums);
      
    }, [forums])
    

   
    


    return (
        <div className="social-posts">

            <div className="social-posts-wrapper">
                <div className="forum-threads-data">
                    <div className="social-posts-header">
                        <span>Threads</span>
                        <Link to={`/forum/editor/${id}`}>
                            <div className='social-post-action'>
                                <i className="bi bi-pencil-square"></i>
                                Create New Thread
                            </div>
                        </Link>
                    </div>



                    {forums && forums.length > 0 && forums.map(item => (
                        <div className="social-thread-card">
                            <Link to={`/forum/thread/${item._id}`}>
                                <div className="thread-card-title">
                                    {item?.title}
                                </div>
                            </Link>

                            <div className="thread-card-stats">
                                <div className="tc-stats-views">
                                    <i className="bi bi-eye-fill"></i>
                                    <span>{item?.views}</span>
                                </div>
                                <div className="tc-stats-comments-counts">
                                    <i className="bi bi-chat-dots-fill"></i>
                                    <span>{item?.replies}</span>
                                </div>
                            </div>



                            <div className="thread-card-footer">
                                <Link to={`/user/${item?.lastRecentActivity ? item?.lastRecentActivity.username : item?.username}`}>
                                    <div className="tc-avatar" style={item?.lastRecentActivity ? { backgroundImage: `url(${item.lastRecentActivity?.userPfp || ''})` } : { backgroundImage: `url(${item?.userPfp || ''})` }} ></div>
                                </Link>
                                <div className="tc-name">
                                    {item?.lastRecentActivity ? `${item.lastRecentActivity?.username || 'user'} replied ${convertTimestampToRelativeTime(item.lastRecentActivity?.timestamp)}` : `By ${item?.username}`}
                                </div>

                            </div>


                            <div className="tc-catagory">
                                {item?.categories && item?.categories?.length > 0 && item.categories.map(item => (
                                    <div className='categories-item' style={{ backgroundColor: categoryColors[item?.name] || '#3db4f2' }}>
                                        {item?.showId && (
                                            <Link to={`/${item?.showId}/details`}>
                                                <div className="go-to-show">
                                                    <i class="bi bi-chevron-up"></i>
                                                </div>
                                            </Link>
                                        )}
                                        {item?.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}


                    {!forums && (
                        <div className="social-posts-NA">
                            No Threads yet...
                        </div>
                    )}


                </div>

                <div className="reviews-data">
                    <div className="social-posts-header">
                        <span>Reviews</span>
                        <Link to={`/review/editor/${id}`}>
                            <div className='social-post-action'>
                                <i className="bi bi-pencil-square"></i>
                                Write a Review
                            </div>
                        </Link>
                    </div>

                    {/* <div className="social-review-card">
                        <div className="review-pfp"></div>
                        <Link to={`/review/111`}>
                            <div className="review-content-box">
                                <span>
                                    A copy of many shows, yet is unmatched in its seasonal execution. Undoubtedly a dark horse of Summer 2024.
                                </span>
                                <div className="review-content-like">
                                    <i className="bi bi-hand-thumbs-up-fill"></i>
                                    <span>953</span>
                                </div>

                            </div>
                        </Link>
                    </div> */}

                    {reviews && reviews.length > 0 &&
                        reviews.map(item => (
                            <div className="social-review-card">
                                <Link to={`/user/${item.username}`}>
                                    <div className="review-pfp" style={{ backgroundImage: item?.userPfp ? `url(${item.userPfp})` : "" }}></div>
                                </Link>
                                <Link to={`/review/${item._id}`}>
                                    <div className="review-content-box">
                                        <span>
                                            {item?.reviewSummary}
                                        </span>
                                        <div className="review-content-like">
                                            <i className="bi bi-hand-thumbs-up-fill"></i>
                                            <span>{item?.likes}</span>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                        ))
                    }


                    {!reviews && (
                        <div className="social-posts-NA">
                            No Reviews yet...
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

export default SocialPosts
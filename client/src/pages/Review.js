import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "../css/Review.css"
import Header from '../components/Header'
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DbContext } from '../context/DbContext';


function Review() {
    document.title = "ShowHub - Review";
    const { id } = useParams();

    const{ token } = useContext(DbContext);
    const [reviewData, setreviewData] = useState(null);
    const [timeElapsed, settimeElapsed] = useState("");

    const handleScoreColor = (score) => {
        if(score >= 0 && score <= 39){
            return "red";
        }
        if(score >= 40 && score <= 69){
            return "orange";
        }
        if(score >= 70){
            return "green";
        }
    }

    const getReviewData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/review/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Reviews:', response.data);
            setreviewData(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const likeReview = async(id) => {
        try {
            const response = await axios.post(`http://localhost:5000/review/${id}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            getReviewData(id);
        } catch (error) {
            console.error(error);
        }
    };

    const disLikeReview = async(id) => {
        try {
            const response = await axios.post(`http://localhost:5000/review/${id}/dislike`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            getReviewData(id);
        } catch (error) {
            console.error(error);
        }
    }

    const convertTimestampToRelativeTime = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const elapsedTime = now - then;

        if (elapsedTime < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (elapsedTime < 3600000) { // Less than 1 hour
            return Math.floor(elapsedTime / 60000) + ' minutes ago';
        } else if (elapsedTime < 86400000) { // Less than 1 day
            return Math.floor(elapsedTime / 3600000) + ' hours ago';
        } else if (elapsedTime < 2592000000) { // Less than 30 days
            return Math.floor(elapsedTime / 86400000) + ' days ago';
        } else {
            return then.toLocaleDateString(); // Format as a regular date
        }
    }

    useEffect(() => {
        getReviewData(id);
    }, [id]);

    useEffect(() => {
        if (reviewData) {
            settimeElapsed(convertTimestampToRelativeTime(reviewData?.timestamp));
        }
    }, [reviewData])


    const renderContent = (value) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value;

        // Wrap all iframes inside a responsive div
        const iframes = tempDiv.getElementsByClassName('ql-video');
        Array.from(iframes).forEach(iframe => {
            const wrapper = document.createElement('div');
            wrapper.className = 'responsive-video-wrapper';
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe); // Move the iframe inside the wrapper
        });

        return { __html: tempDiv.innerHTML };
    };

    // const [value, setValue] = useState('');

    return (
        <div className="review">
            <Header onPage={true} />
            <div className="review-header" style={{ backgroundImage: reviewData?.showBanner ? `url(${reviewData.showBanner})` : "" }} >
                <div className="review-header-wrapper">
                    <Link to={`/${reviewData?.showId}/details`}>
                        <div className="rh-title">
                            <h3>{reviewData?.showTitle}</h3>
                        </div>
                    </Link>
                    <div className="rh-author">
                        a review by <Link to = {`/user/${reviewData?.username}`}>{reviewData?.username}</Link>
                    </div>

                    <div className="rh-time">
                        {timeElapsed || ""}
                    </div>
                </div>
            </div>

            <div className="review-container">
                <div className="review-text">

                    {reviewData && <div dangerouslySetInnerHTML={renderContent(reviewData?.reviewText)} />}

                    <div className={`review-score ${handleScoreColor(reviewData?.score)}`}>
                        <span id='gotten-score'>{reviewData?.score}</span>
                        <span id='max-score'>/100</span>
                    </div>
                </div>

                <div className="review-ratings">
                    <div className="rr-actions">
                        <div className={`rr-action-dislike ${reviewData?.status === "disliked"? 'disliked' : ''}`} onClick={()=> disLikeReview(id)}>
                            <i className="bi bi-hand-thumbs-down-fill"></i>
                        </div>
                        <div className={`rr-action-like ${reviewData?.status === "liked" ? 'liked' : ''}`} onClick={() => likeReview(id)}>
                            <i className="bi bi-hand-thumbs-up-fill"></i>
                        </div>
                    </div>
                    <span>{reviewData?.likes} users liked this review</span>
                </div>




            </div>
        </div>
    )
}

export default Review
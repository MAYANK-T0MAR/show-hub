import React, { useContext, useEffect, useState } from 'react';
import { Input } from 'antd';
import "../css/ReviewEditor.css";
import { useParams } from 'react-router-dom';
import { Context } from '../context/context';
import Header from '../components/Header';
import RichTextEditor from '../components/RichTextEditor';
import axios from 'axios';
import { DbContext } from '../context/DbContext';

const { TextArea } = Input;

function ReviewEditor() {
    document.title = "ShowHub - Review Editor";
    const { id } = useParams();
    const { banner, details, getDetails } = useContext(Context);
    const { token } = useContext(DbContext);
    const [showTitle, setShowTitle] = useState("");
    const [reviewSummary, setReviewSummary] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewScore, setreviewScore] = useState(0);
    const [reviewIsPrivate, setReviewIsPrivate] = useState(false);


    const reviewData = {
        showId : id,
        showTitle : showTitle,
        showBanner : banner,
        reviewSummary : reviewSummary,
        reviewText : reviewText,
        score : reviewScore || 0,
        private : reviewIsPrivate,
    }




    const handleReviewSummaryChange = (e) => {
        setReviewSummary(e.target.value);
    };


    const reviewHasMoreThan2200Character = () => {
        let contentWithoutSpacesAndTags = reviewText.replace(/<[^>]*>/g, '').replace(/\s{2,}/g, ' ');
        return contentWithoutSpacesAndTags.length > 20;
    };

    const reviewSummaryIsLongEnough = () => {
        let validContent = reviewSummary.replace(/\s{2,}/g, ' ').replace(/\n/g, '');
        return validContent.length > 20 && validContent.length < 120;
    }

    

    const handleScoreChange = (e) => {
        setreviewScore(e.target.value);
    }



    const postReview = async() => {
        console.log(`show id : ${reviewData.showId}`);
        
        if(reviewHasMoreThan2200Character() && reviewSummaryIsLongEnough()){
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/post-review`,
                    reviewData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include the token in the request header
                        }
                    }
                );
    
                console.log('Success:', response.data);
                window.location.href = `/${id}/details`;
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }



    useEffect(() => {
        if (reviewScore < 0) {
            setreviewScore(0);
        }
        if (reviewScore > 100) {
            setreviewScore(100)
        }
        if (reviewScore.toString().startsWith('0')) {
            setreviewScore(parseInt(reviewScore.toString().replace(/^0+/, '')))
        }

    }, [reviewScore])


    useEffect(() => {
        getDetails(id);
    }, [id]);

    useEffect(() => {
        setShowTitle(details?.name);
    }, [details]);

    




    // useEffect(() => {
    //   console.log(reviewSummary);

    // }, [reviewSummary])






    return (
        <div className='review-editor'>
            <Header />
            <div className="review-editor-container">
                <div className="re-summary">
                    <div className='re-title'>Review Summary</div>
                    <div className="re-input">
                        <TextArea
                            value={reviewSummary}
                            onChange={handleReviewSummaryChange}
                            autoSize={{ minRows: 1 }} // Adjust min and max rows as needed
                            size='large'
                            style={{
                                width: '100%',
                                resize: 'none',       // Prevent manual resizing
                            }}
                            className='notes-textarea'
                            placeholder='Write Review Summary...'
                        />
                    </div>
                    <div className="re-suggestion">*Must be more than 20 and less than 120 characters</div>
                </div>

                <div className="re-main-text">
                    <div className="re-title">Review</div>
                    <div className="re-input">
                        <RichTextEditor value={reviewText} setValue={setReviewText} placeholderValue= "Write review..." />
                    </div>
                    <div className="re-suggestion">
                        *Must be more than 20 characters
                    </div>
                </div>

                <div className="re-score">
                    <div className="re-score-wrapper">
                        <div className="re-title">Score</div>
                        <div className="re-score-input">
                            <input
                                type="number"
                                value={reviewScore}
                                onChange={handleScoreChange}
                                placeholder='0'
                            />

                        </div>
                    </div>
                </div>

                <div className="re-private">
                    <div className="re-private-wrapper">
                        <input type="checkbox" value={reviewIsPrivate} onChange={() => setReviewIsPrivate(!reviewIsPrivate)} name="" id="" />
                        <div className="re-title">Private</div>
                    </div>
                </div>

                <div className="re-post">
                    <div className="re-post-wrapper">
                        {reviewHasMoreThan2200Character() && reviewSummaryIsLongEnough() ?
                            <button className='btn btn-primary post-btn' onClick={() => postReview()}>Post</button>

                            :
                            <div className="re-errors">
                                {!reviewHasMoreThan2200Character() &&
                                    <div className="re-error-item">
                                        the review should be more than 20 characters long
                                    </div>
                                }
                                {!reviewSummaryIsLongEnough() &&
                                    <div className="re-error-item">
                                        the review summary must be less than 120 and greater than 20 characters
                                    </div>
                                }
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewEditor


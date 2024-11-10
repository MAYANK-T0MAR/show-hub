import React, { useContext, useEffect, useState } from 'react'
import "../css/ForumThread.css";
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { DbContext } from '../context/DbContext';
import CommentBox from '../components/CommentBox';
import CommentEditor from '../components/CommentEditor';
import axios from 'axios';


function ForumThread() {
    const { id } = useParams();
    const [forumData, setForumData] = useState(null)
    const { categoryColors, convertTimestampToRelativeTime } = useContext(DbContext);
    const [showCommentEditor, setShowCommentEditor] = useState(false);
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyingToUser, setReplyingToUser] = useState("");
    document.title = "ShowHub - Forum Thread";

    const openCommentEditorForReplying = (userId, username) => {
        setReplyingToId(userId);
        setReplyingToUser(username);
        console.log(`for replying function ran, userId : ${replyingToId}, ${replyingToUser}`);

        setShowCommentEditor(true);
    }

    const openCommentEditorForCommenting = () => {
        setReplyingToId(null);
        setReplyingToUser("");
        console.log(`for commenting function ran, userId : ${replyingToId}, ${replyingToUser}`);

        setShowCommentEditor(true);
    }



    const getForumDetails = async () => {
        if (id) {
            try {
                let response = await axios.get(`${process.env.REACT_APP_API_URL}/forum/${id}`);
                let sortedData = response.data;

                // Sort comments by timestamp in descending order
                sortedData.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setForumData(sortedData)
                console.log(response.data);

            } catch (error) {
                console.error(`error fetching the forum : ${error}`);
            }
        }
    }


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

    const categories = [
        "General",
        "Gaming",
        "Music",
        "Anime",
        // "Upcoming", 
        // "News", 
        // "Recommendations", 
        // "Bugs & Feedback", 
        // "Favourite Shows", 
        // "Underrated Shows", 
        // "Show Comparisons",
        // "Classic TV Shows",
        // "Iconic Show Lines",
        // "Release Discussion",
        // "Currently Watching",
        // "Binge-Worthy Shows",
        // "Episode Discussions",
    ];


    const replies = [
        {
            _id: 1,
            userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
            username: "user1",
            timestamp: "5 days ago",
            likes: 81,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
            replies: []
        },
        {
            _id: 2,
            userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
            username: "user2",
            timestamp: "5 days ago",
            likes: 81,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
            replies: [
                {
                    _id: 3,
                    userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
                    username: "commentor1",
                    timestamp: "5 days ago",
                    likes: 20,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
                    replies: [
                        {
                            _id: 4,
                            userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
                            username: "commentor2",
                            timestamp: "5 days ago",
                            likes: 20,
                            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
                            replies: []
                        },
                        {
                            _id: 5,
                            userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
                            username: "commentor21",
                            timestamp: "5 days ago",
                            likes: 20,
                            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
                            replies: []
                        }
                    ]
                },
                {
                    _id: 6,
                    userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
                    username: "commentor3",
                    timestamp: "5 days ago",
                    likes: 20,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
                    replies: []
                }
            ]
        },
        {
            _id: 7,
            userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
            username: "user3",
            timestamp: "5 days ago",
            likes: 81,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
            replies: []
        },
        {
            _id: 8,
            userPfp: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
            username: "user4",
            timestamp: "5 days ago",
            likes: 81,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ex voluptatem? Est.",
            replies: []
        },


    ];





    useEffect(() => {
        getForumDetails();
    }, [id])


    useEffect(() => {
        console.log(forumData);
    }, [forumData])




    return (
        <div className='forum-thread'>
            <Header />
            {showCommentEditor &&
                <CommentEditor
                    forumId={id}
                    showCommentEditor={showCommentEditor}
                    setShowCommentEditor={setShowCommentEditor}
                    placeholderValue={replyingToUser !== "" ? `reply ${replyingToUser}` : "Write Comment..."}
                    replyingToId={replyingToId}
                    replyingToUser={replyingToUser}
                    getForumDetails={getForumDetails}
                />}
            <div className="forum-thread-container">
                <div className="thread-title ft-wrapper">{forumData?.title || 'Title'}</div>
                <div className="thread-body ft-wrapper">
                    <div className="tb-header">
                        <div className="tb-user">
                            <div className="tb-user-pfp" style={forumData?.userId?.pfp ? { backgroundImage: `url(${forumData?.userId?.pfp})` } : { backgroundColor: 'gray' }}></div>
                            <div className="tb-username">{forumData?.userId?.username || 'user'}</div>
                        </div>
                        <div className="tb-time">{forumData?.timestamp ? convertTimestampToRelativeTime(forumData?.timestamp) : ''}</div>
                    </div>

                    <div className="tb-description">{forumData?.description ? <div dangerouslySetInnerHTML={renderContent(forumData?.description)} /> : ''}</div>

                    <div className="tb-footer">
                        <div className="tb-categories">
                            {forumData?.category.map(item => (
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
                        <div className="tb-actions">
                            <button className='tb-actions-like'>
                                <span>{forumData?.likes?.length}</span>
                                <i className="bi bi-suit-heart-fill"></i>
                            </button>
                            <button className='tb-actions-comment' onClick={() => openCommentEditorForCommenting()}>
                                <i className="bi bi-reply-fill"></i>
                                <span>Comment</span>
                            </button>
                        </div>
                    </div>
                </div>

                {forumData?.comments && forumData?.comments?.length > 0 && (
                    <div className="thread-reply-header ft-wrapper">
                        {forumData?.comments?.length} Replies
                    </div>
                )}
                <div className="thread-replies ft-wrapper">
                    {forumData?.comments && forumData?.comments?.length > 0 ? forumData?.comments?.map(item => (
                        <CommentBox
                            _id={item?._id}
                            userPfp={item?.userId?.pfp}
                            username={item?.userId?.username}
                            timestamp={item?.timestamp}
                            likes={item?.likes?.length}
                            text={item?.text}
                            replies={item?.replies}
                            depth={0}
                            openCommentEditorForReplying={openCommentEditorForReplying}
                        />
                    )) : (
                        <div className="forum-thread-NA">
                            No Replies Yet...
                        </div>
                    )
                    }

                </div>
            </div>

        </div>
    )
}

export default ForumThread
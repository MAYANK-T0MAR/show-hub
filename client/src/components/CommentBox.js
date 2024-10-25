import React from 'react'
import "../css/CommentBox.css"
import { DbContext } from '../context/DbContext';
import { useContext } from 'react';

function CommentBox({ _id ,userPfp, username, timestamp, likes, text, replies, depth, openCommentEditorForReplying }) {
    let thisDepth = depth;
    const { convertTimestampToRelativeTime } = useContext(DbContext);

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

    return (
        <div className={`comment-box ${thisDepth % 2 === 0 ? 'even-child' : 'odd-child' }`}>

            <div className='cb-header'>
                <div className="cb-user">
                    <div className="cb-user-pfp" style={userPfp ? { backgroundImage: `url(${userPfp})` } : { backgroundColor: 'gray' }}></div>
                    <div className="cb-username">{username}</div>
                    <div className="cb-user-timestamp">{convertTimestampToRelativeTime(timestamp)}</div>
                </div>

                <div className="cb-actions">
                    <div className="cb-like">
                        <span>{likes}</span>
                        <i className="bi bi-heart-fill"></i>
                    </div>
                    <div className="cb-reply" onClick={()=> openCommentEditorForReplying(_id, username)}>
                        <i className="bi bi-reply-fill cb-reply-icon"></i>
                    </div>
                </div>
            </div>



            <div className="cb-description">
                <div dangerouslySetInnerHTML={renderContent(text)} />
                
            </div>


            {replies && replies.length > 0 && (
                <div className="cb-replies">
                    {replies && replies.length > 0 && replies.map(item => (
                        <CommentBox
                            _id={item?.userId?._id}
                            userPfp={item?.userId?.pfp}
                            username={item?.userId?.username}
                            timestamp={item.timestamp}
                            likes={item.likes}
                            text={item.text}
                            replies={item.replies}
                            depth = {depth+1}
                            openCommentEditorForReplying={openCommentEditorForReplying}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

export default CommentBox
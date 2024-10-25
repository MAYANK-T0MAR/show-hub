import React, { useState, useContext } from 'react'
import "../css/CommentEditor.css"
import RichTextEditor from './RichTextEditor';
import axios from 'axios';
import { DbContext } from '../context/DbContext';

function CommentEditor({ forumId, showCommentEditor, setShowCommentEditor, placeholderValue, replyingToId, replyingToUser, getForumDetails }) {

    const { token } = useContext(DbContext);
    const [commentData, setcommentData] = useState("");
    const dataToPost = {
        text: commentData
    }

    const postComment = async () => {
        if (!replyingToId) {
            try {
                let response = await axios.post(`http://localhost:5000/post-comment/${forumId}`, dataToPost, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('success: ', response.data);
                getForumDetails();
                setShowCommentEditor(false);
            } catch (error) {
                console.error(error);
            }
        }
        if(replyingToId && replyingToUser!== ""){
            console.log(`replying to id : ${replyingToId} and username : ${replyingToUser}`);
            
            try {
                let response =  await axios.post(`http://localhost:5000/post-reply/${forumId}/${replyingToId}`, dataToPost, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('success: ', response.data);
                getForumDetails();
                setShowCommentEditor(false);
            } catch (error) {
                console.error(error);
            }
        }

    }

    return (
        <div className='comment-editor'>

            <div className="comment-editor-wrap">
                <div className="comment-editor-title">
                    <span>{replyingToId ? `Reply to ${replyingToUser}` : "Post a Comment"}</span>
                </div>
                <RichTextEditor
                    value={commentData}
                    setValue={setcommentData}
                    placeholderValue="Write here..."
                />

                <div className="comment-editor-action">
                    <button className="btn btn-secondary" onClick={() => setShowCommentEditor(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={()=> postComment()}>Post</button>
                </div>
            </div>

        </div>
    )
}

export default CommentEditor
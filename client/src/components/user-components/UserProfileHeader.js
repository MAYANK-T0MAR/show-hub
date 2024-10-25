import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "../../css/user-css/UserProfileHeader.css"
import { useParams } from 'react-router-dom';
import { DbContext } from '../../context/DbContext';



function UserProfileHeader({currentPage}) {
    const { username } = useParams();
    const { fetchProfile, profile, isOwner } = useContext(DbContext);
    const userLinks = ["Overview", "Lists", "Reviews"];

    useEffect(() => {
        fetchProfile(username);
    }, [username]);



    return (
        <>
            <div className="user-banner" style={profile?.banner ? { backgroundImage: `url(${profile.banner})` } : {}} >
                <div className="user-content-wrapper">
                    <div className="user-intro">
                        <img className="user-poster" src={profile?.pfp ? profile.pfp : ''} alt="" />
                        <div className="user-details">
                            <span id='user-intro-title'>
                                {profile?.username || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="user-profile-menu">
                {userLinks.map(item => (
                    <Link className={item === currentPage ? 'highlightCurrentPage' : 'linkToPage'} id={item+`-link`} to = {`/user/${username}/${item !== "Overview" ? item.toLowerCase() : ''}`}>{item}</Link>
                ))}
                {/* <Link id='overview-link' to = {`/user/${username}`}>Overview</Link>
                <Link to = {`/user/${username}/lists`}>Lists</Link>
                <Link to = {`/user/${username}/reviews`}>Reviews</Link>
                <Link to = {`/user/${username}/followers`}>Followers</Link>
                <Link to = {`/user/${username}/following`}>Following</Link>
                <Link to = {`/user/${username}/forum-threads`}>Forum Thread</Link>
                <Link to = {`/user/${username}/forum-comments`}>Forum Comments</Link> */}
            </div>
        </>
    )
}

export default UserProfileHeader
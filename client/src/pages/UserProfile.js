import React, { useContext, useEffect, useState } from 'react'
import "../css/UserProfile.css"
import Header from '../components/Header'
import UserProfileHeader from '../components/user-components/UserProfileHeader'
import { useParams } from 'react-router-dom'

function UserProfile() {
    
    const { username } = useParams();
    document.title = username ? `${username || ''}'s profile - ShowHub` : "User Profile - ShowHub";


    return (
        <div className='user-profile'>
            <Header onPage={true} />
            <UserProfileHeader currentPage={"Overview"}/>
            <div className="overview-container">
                overview will go here....
            </div>
        </div>
    )
}

export default UserProfile
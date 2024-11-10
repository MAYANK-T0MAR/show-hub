import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import GlobalAlert from "../components/GlobalAlert";







export const DbContext = createContext();

const DbContextProvider = (props) => {
    const [profile, setProfile] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const token = localStorage.getItem('token');
    const [ownerUsername, setownerUsername] = useState("");

    const categoryColors = {
        General: "#a83232",           // Darker red
        Gaming: "#c66919",            // Darker orange
        Music: "#a8a13a",             // Darker yellow
        Anime: "#5c9d48",             // Darker green
        Upcoming: "#3b8ea0",          // Darker blue
        News: "#526e9c",              // Darker indigo
        Recommendations: "#6e569c",   // Darker purple
        "Bugs & Feedback": "#a35b89", // Darker pink
        "Favourite Shows": "#8b8b8b", // Darker grey
        "Underrated Shows": "#a8485b", // Darker rose
        "Show Comparisons": "#b07029", // Darker tan
        "Classic TV Shows": "#a6a63b", // Darker olive
        "Iconic Show Lines": "#408492",// Darker teal
        "Release Discussion": "#7d6a9e", // Darker lavender
        "Currently Watching": "#ae7a45", // Darker brown-orange
        "Binge-Worthy Shows": "#7a3d3d", // Darker maroon
        "Episode Discussions": "#4a6b7d" // Darker slate blue
    };

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);

            setownerUsername(decodedToken.username);
            const currentTime = Date.now() / 1000;
            decodedToken.exp < currentTime ? setShowAlert(true) : setShowAlert(false);
            console.log(token);
        }
    }, [])




    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            console.log(`token exp : ${decodedToken.exp}`);
            console.log(`current time : ${currentTime}`);

            console.log(`expiration : ${Date(decodedToken.exp * 1000)}`);
            console.log(`current time : ${Date(currentTime * 1000)}`);


            if (decodedToken.exp < currentTime) {
                console.log('the token has been expired');

                // Token has expired, attempt to refresh it
                refreshToken();
            } else if (decodedToken.exp < currentTime + 60 * 60 * 24) {
                // Token is about to expire within 1 day, refresh it
                refreshToken();
            } else {
                setAuthenticated(true);
            }
        }
    }, [])



    const refreshToken = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/refresh-token`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.setItem('token', response.data.token);
            setAuthenticated(true);
            setShowAlert(false);
        } catch (error) {
            console.error('Error refreshing token:', error);
            setAuthenticated(false);
            setShowAlert(true);
        }
    };

    const fetchProfile = async (username) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);

            setProfile(response.data);
            setIsOwner(response.data.isOwner);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };


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

    const logout = () => {
        localStorage.removeItem('token');
        setAuthenticated(false);
        console.log("Logged out Successfully !!");
    }


    const likeForum = async(forumId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/forum/like/${forumId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };



    const DbContextValue = {
        fetchProfile,
        profile,
        isOwner,
        logout,
        authenticated,
        token,
        setAuthenticated,
        setownerUsername,
        ownerUsername,
        categoryColors,
        convertTimestampToRelativeTime,
    }

    return (
        <DbContext.Provider value={DbContextValue}>
            {props.children}
            {showAlert && <GlobalAlert message="Session expired, please refresh the page" showAlert={showAlert} />}
        </DbContext.Provider>
    )
}

export default DbContextProvider;
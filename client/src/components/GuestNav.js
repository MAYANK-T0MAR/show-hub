import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "../css/GuestNav.css"
import { DbContext } from '../context/DbContext';
function GuestNav({ loginOpened, setloginOpened, signUpOpened, setsignUpOpened }) {
    const navigate = useNavigate();
    const { authenticated, logout, ownerUsername } = useContext(DbContext);

    return (
        <div className='guest-nav'>
            <Link to="/">
                <div className="logo">
                    LOGO
                </div>
            </Link>

            <div className="links">
                {authenticated && (
                    <div className="link">
                        <Link to={`/user/${ownerUsername}`}>Profile</Link>
                    </div>
                )}
                <div className="link">
                    <Link to="/#home-search">Search</Link>
                </div>
                {/* <div className="link">Social</div> */}
                {/* <div className="link">Forum</div> */}
                {authenticated && (
                    <div className="link" onClick={() => {
                        logout();
                        navigate('/');
                    }}>Logout</div>
                )}
            </div>

            {!authenticated && (
                <div className="signup">
                    <div className="link" onClick={() => {
                        setloginOpened(!loginOpened);
                        setsignUpOpened(!signUpOpened);
                    }}>Login</div>
                    <button id='signup-button' onClick={() => { setsignUpOpened(!signUpOpened) }} >SignUp</button>
                </div>
            )}
        </div>
    )
}

export default GuestNav
import React, { useContext, useEffect, useState } from 'react'
import '../css/Header.css'
import { Link } from 'react-router-dom';
import SignUp from './SignUp';
import GuestNav from './GuestNav';
import { DbContext } from '../context/DbContext';


function Header({ onPage }) {
    const { authenticated, ownerUsername } = useContext(DbContext);
    const [signUpOpened, setsignUpOpened] = useState(false);
    const [loginOpened, setloginOpened] = useState(false);
    const [show, setShow] = useState(true);
    const [mobNavExpand, setmobNavExpand] = useState(false);
    let lastScrollY = window.scrollY;

    const signUpClosed = () => {
        setsignUpOpened(false);
        setloginOpened(false);
    }
    const openLogin = () => {
        setloginOpened(!loginOpened);
    }
    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) {
            // If scrolled down
            setShow(false);
        } else {
            // If scrolled up
            setShow(true);
        }
        lastScrollY = window.scrollY;
    };

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, []);





    return (
        <>
            <div className={`navbar ${show ? 'navbar--visible' : 'navbar--hidden'} ${onPage ? `onPageNavbar` : ``}`} >
                <GuestNav
                    loginOpened={loginOpened}
                    setloginOpened={setloginOpened}
                    signUpOpened={signUpOpened}
                    setsignUpOpened={setsignUpOpened}
                />
            </div>

            <SignUp isOpen={signUpOpened} onClose={signUpClosed} loginOpened={loginOpened} openLogin={openLogin} />

            <div className="mobile-nav">
                <div className={`hamburger ${mobNavExpand ? 'hidden' : ''}`} onClick={() => setmobNavExpand(true)}>
                    <div className="ham-lines"></div>
                    <div className="ham-lines"></div>
                    <div className="ham-lines"></div>
                </div>
                <div className={`mobile-menu ${mobNavExpand ? 'visible' : ''}`}>
                    {/* <div className="mobile-menu-actions">
                        <i className="bi bi-chat-dots-fill"></i>
                        <span className='mobile-menu-actions-text' >Forum</span>
                    </div> */}
                    {/* <div className="mobile-menu-actions">
                        <i className="bi bi-people-fill"></i>
                        <span className='mobile-menu-actions-text' >Social</span>
                    </div> */}
                    <Link to="/#home-search">
                        <div className="mobile-menu-actions">
                            <i className="bi bi-search"></i>
                            <span className='mobile-menu-actions-text' >Search</span>
                        </div>
                    </Link>
                    {!authenticated && (
                        <>
                            <div className="mobile-menu-actions"
                                onClick={() => {
                                    setsignUpOpened(!signUpOpened);
                                    setmobNavExpand(false);
                                }}
                            >
                                <i className="bi bi-person-fill-add"></i>
                                <span className='mobile-menu-actions-text'>SignUp</span>
                            </div>
                            <div className="mobile-menu-actions"
                                onClick={() => {
                                    setloginOpened(!loginOpened);
                                    setsignUpOpened(!signUpOpened);
                                    setmobNavExpand(false);
                                }}
                            >
                                <i className="bi bi-box-arrow-in-right"></i>
                                <span className='mobile-menu-actions-text'>Sign In</span>
                            </div>
                        </>
                    )}
                    <Link to={`/user/${ownerUsername}`}>
                        <div className="mobile-menu-actions">
                            <i className="bi bi-person-fill"></i>
                            <span className='mobile-menu-actions-text' >Profile</span>
                        </div>
                    </Link>
                    <div className="mobile-menu-actions">
                        <i className="bi bi-gear-fill"></i>
                        <span className='mobile-menu-actions-text' >Settings</span>
                    </div>
                    <div className="mobile-menu-actions" onClick={() => setmobNavExpand(false)}>
                        <i className="bi bi-x-circle-fill"></i>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Header
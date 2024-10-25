import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/SignUp.css";
import axios from 'axios';
import { DbContext } from '../context/DbContext';

function SignUp({ isOpen, onClose, loginOpened, openLogin }) {
    const { setAuthenticated, setownerUsername } = useContext(DbContext);
    //for signup data
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    //for login data
    const [loginFormData, setloginFormData] = useState({
        email: '',
        password: '',
    })

    //for errors in signup form
    const [errors, setErrors] = useState({});

    //for errors in login form
    const [loginErrors, setloginErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginChange = (e) =>{
        setloginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
        });
    };


    //signup form validation
    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email is not valid";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //login form validation
    const validateLoginForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!loginFormData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(loginFormData.email)) {
            newErrors.email = "Email is not valid";
        }

        // Password validation
        if (!loginFormData.password) {
            newErrors.password = "Password is required";
        } else if (loginFormData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        setloginErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const checkAvailability = async (field, value) => {
        try {
            const response = await axios.post(`http://localhost:5000/check-${field}`, { value });
            return response.data.available;
        } catch (error) {
            console.error(`There was an error checking ${field} availability:`, error);
            return false;
        }
    };


    //for submitting the signup data
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return false;
        }

        // Check if username is available
        const usernameAvailable = await checkAvailability('username', formData.username);
        if (!usernameAvailable) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                username: "Username already exists",
            }));
            return false;
        }

        // Check if email is available
        const emailAvailable = await checkAvailability('email', formData.email);
        if (!emailAvailable) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: "Email already exists",
            }));
            return false;
        }

        try {
            const response = await axios.post('http://localhost:5000/signup', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            console.log("User created successfully:", response.data);
            setAuthenticated(true);
            setownerUsername(response.data.username);
            navigate(`/user/${response.data.username}`);
            
            return true;
        } catch (error) {
            console.error('There was an error submitting the form:', error);
            return false;
        }
    };


    //for submitting the login data
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return false;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', loginFormData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            console.log("User logged in successfully:", response.data);
            setAuthenticated(true);
            setownerUsername(response.data.username);
            navigate(`/user/${response.data.username}`);
            return true;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Display the error message returned by the server
                setloginErrors({ general: error.response.data.message });
            } else {
                console.error('There was an error submitting the form:', error);
            }
            return false;
        }
    };


    //to close the form
    const handleClose = (e) => {
        e.preventDefault();
        onClose();
    };

    //to switch to the login form
    const handleOpenLogin = (e) => {
        e.preventDefault();
        openLogin(); //from the prop passed down by the header.js 
    }

    
    return (
        <div className={`sign-up ${isOpen ? 'opened' : 'closed'}`}>
            <div className="login-prompt">
                <button className='form-buttons' id='form-change-prompt-btn' onClick={handleOpenLogin}>
                    {loginOpened? "New here? Signup" : "Already a member? Login"}
                </button>
            </div>

            <form className={`signup-form ${loginOpened? 'close' : ''}`}>
                <div className="form-group">
                    <input
                        required
                        name='username'
                        type="text"
                        className="input"
                        placeholder="Enter your username"
                        onChange={handleChange}
                        value={formData.username}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>
                
                <div className="form-group">
                    <input
                        required
                        id='signup-email-input'
                        name='email'
                        type="text"
                        className="input"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        value={formData.email}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>

                <div className="form-group">
                    <input
                        required
                        name='password'
                        type="password"
                        className="input"
                        placeholder="*********"
                        onChange={handleChange}
                        value={formData.password}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>

                <button
                    className='form-buttons'
                    id='submit-btn'
                    onClick={async (e) => {
                        e.preventDefault();
                        const isFormValid = await handleSubmit(e);
                        if (isFormValid) {
                            handleClose(e);
                        }
                    }}
                >Submit</button>
                <button className='form-buttons' id='signup-close-btn' onClick={handleClose}>Close</button>
            </form>



            {/* login form starts here ------------------------------------------- */}
            <form className={`login-form ${loginOpened? '' : 'close'}`}>
            {loginErrors.general && <div className="error">{loginErrors.general}</div>}
                <div className="form-group">
                    <input
                        required
                        id='login-email-input'
                        name='email'
                        type="text"
                        className="input"
                        placeholder="Enter your email"
                        onChange={handleLoginChange}
                        value={loginFormData.email}
                    />
                    {loginErrors.email && <div className="error">{loginErrors.email}</div>}
                </div>

                <div className="form-group">
                    <input
                        required
                        name='password'
                        type="password"
                        className="input"
                        placeholder="*********"
                        onChange={handleLoginChange}
                        value={loginFormData.password}
                    />
                    {loginErrors.password && <div className="error">{loginErrors.password}</div>}
                </div>

                <button
                    className='form-buttons'
                    id='login-submit-btn'
                    onClick={async (e) => {
                        e.preventDefault();
                        const isFormValid = await handleLoginSubmit(e);
                        if (isFormValid) {
                            handleClose(e);
                        }
                    }}
                >Submit</button>
                <button className='form-buttons' id='login-close-btn' onClick={handleClose}>Close</button>
            </form>
        </div>
    );
}

export default SignUp;

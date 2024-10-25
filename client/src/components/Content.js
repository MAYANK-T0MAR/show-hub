import React, { useContext, useEffect, useState } from 'react';
import '../css/Content.css'
import MovieCards from './MovieCards';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import { Context } from '../context/context';
import axios from 'axios';

function Content() {
    const { query, setquery } = useContext(Context);
    // const [query, setquery] = useState("");
    const [data, setData] = useState([]);
    const [userData, setuserData] = useState(null);
    const [loading, setloading] = useState(false);

    const [selectedMode, setSelectedMode] = useState("Shows");
    const [optionListExpanded, setOptionListExpanded] = useState(false);


    const getData = async () => {
        setloading(true);
        try {
            let response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            let responseData = await response.json();
            setData(responseData);
            setloading(false);
        } catch (error) {
            console.error(error);

        }

    }


    const getUserData = async () => {
        setloading(true);
        try {
            let response = await axios.get(`http://localhost:5000/search-users/${query}`);
            setuserData(response.data);
            setloading(false);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (selectedMode === "Shows") {
            getData();
        }
        if (selectedMode === "Users") {
            getUserData();
        }
    }, [query, selectedMode]);

    


    return (
        <div className="data">
            <div className="search-area" id='home-search'>
                <div className="input-box-wrapper">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setquery(e.target.value)}
                        placeholder='Search'
                        className='input-box'
                    />
                    <div className="search-mode" onClick={() => setOptionListExpanded(!optionListExpanded)}>
                        <i className="bi bi-search"></i>
                        <span>{selectedMode}</span>
                    </div>
                    <div className={`mode-options ${optionListExpanded ? 'expand-options' : ''}`}>
                        <span onClick={() => {
                            setSelectedMode("Shows");
                            setOptionListExpanded(false);
                        }}>Shows</span>
                        <span onClick={() => {
                            setSelectedMode("Users");
                            setOptionListExpanded(false);
                        }}>Users</span>
                    </div>
                </div>

            </div>

            {selectedMode === "Shows" ?
                <div className="movie-data">

                    {loading ? (
                        <Loader />
                    ) : (
                        data.map(item => (
                            <Link to={`/${item.show.id}/details`}>
                                <MovieCards key={item.show.id} image={item.show.image && item.show.image.medium} name={item.show.name} />
                            </Link>
                        ))
                    )}

                </div>
                :
                <div className="user-content-data">
                    {loading ? (<Loader />) : (
                        userData && userData.length > 0 && userData.map(item => (
                            <Link to={`/user/${item?.username}`}>
                                <div className="ucd-user">
                                    <div className="ucd-pfp" style={item?.pfp ? { backgroundImage: `url(${item?.pfp})` } : { backgroundColor: 'gray' }}></div>
                                    <div className="ucd-username">{item?.username}</div>
                                </div>
                            </Link>
                        ))

                    )
                    }
                </div>
            }
        </div>
    )
}

export default Content
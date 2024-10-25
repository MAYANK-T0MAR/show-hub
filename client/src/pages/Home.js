import React, { useContext, useEffect, useState } from 'react'
import "../css/Home.css"
import Header from '../components/Header'
import Welcome from '../components/Welcome'
import Content from '../components/Content'
import { useLocation } from 'react-router-dom'
import { Context } from '../context/context'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import MovieCards from '../components/MovieCards'
import SignUp from '../components/SignUp'

function Home() {
    document.title = "ShowHub - Home";
    const [showIndexLoading, setshowIndexLoading] = useState(true);
    const { getShowsIndex, ShowIndex, SignUpOpen } = useContext(Context);
    const [NetflixShows, setNetflixShows] = useState([]);
    const { hash } = useLocation();
    useEffect(() => {
        if (hash === "#home-search") {
            const scrollToElement = () => {
                const element = document.getElementById('home-search');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            };

            setTimeout(() => {
                scrollToElement();
            }, 100);
        }
    }, [hash]);

    useEffect(() => {
        getShowsIndex();
    }, [])

    useEffect(() => {
        if (ShowIndex.length > 0) {
            // setNetflixShows(ShowIndex.filter(item=> item.webChannel.name === "Netflix"));
            setshowIndexLoading(false);
        }
    }, [ShowIndex])

    useEffect(() => {
      console.log(ShowIndex.filter(item=> item.webChannel?.name === "Netflix"));
    }, [ShowIndex])

    useEffect(() => {
      console.log(NetflixShows);
      
    }, [NetflixShows])
    
    

    return (
        <div className="Home">
            <Header />
            <div className="hero">
                <Welcome />
            </div>
            <div className="page-content">
                <Content />
            </div>
            <div className="currently-streaming">
                <div className="cs-content">
                    <h3 id='cs-content-title'>Shows</h3>
                    <div className="cs-result-data">
                        {showIndexLoading ? (
                            <Loader />
                        ) : (
                            ShowIndex.map(item => (
                                <Link to={`/${item.id}/details`}>
                                    <MovieCards key={item.id} image={item.image && item.image.medium} name={item.name} />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
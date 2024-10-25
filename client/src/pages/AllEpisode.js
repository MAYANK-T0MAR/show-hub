import React, { useContext, useEffect, useState } from 'react'
import "../css/AllEpisode.css"
import { Context } from '../context/context';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
function AllEpisode() {
    const { details, episodes, banner, poster, getDetails } = useContext(Context);
    document.title = `${details?.name || ''}'s All Episode - ShowHub`;

    const { id } = useParams();
    const [totalSeasons, settotalSeasons] = useState("");
    const [loadedEpisode, setloadedEpisode] = useState([]);
    const [episodeLoading, setepisodeLoading] = useState(true);
    const [activeSeason, setactiveSeason] = useState(1);
    const [fadeIn, setFadeIn] = useState(false);
    const [topTwoEps, settopTwoEps] = useState([]);

    const renderSeasons = (totalSeasons) => {
        const seasonElements = [];
        for (let i = 1; i <= totalSeasons; i++) {
            seasonElements.push(
                <div className={`aech-season-child ${activeSeason == i ? "aech-season-child--active" : ""}`}
                    key={i}
                    onClick={() => setactiveSeason(i)}
                >
                    {i}
                </div>
            );
        }
        return seasonElements;
    };

    useEffect(() => {
        if (activeSeason !== null) {
            setFadeIn(false); // Remove the fade-in class
            setTimeout(() => setFadeIn(true), 200);
        }
    }, [activeSeason]);

    useEffect(() => {
        getDetails(id);
    }, [id]);

    useEffect(() => {
        if (episodes.length > 0) {
            settotalSeasons(episodes[episodes.length - 1].season);
        }
    }, [episodes]);

    useEffect(() => {
        setloadedEpisode([]);
        if (episodes && episodes.length > 0) {
            setloadedEpisode(episodes);
            let filteredEpisodes = episodes.filter(item => item.rating && item.rating.average !== null);
            let topRatedEps = filteredEpisodes.sort((a, b) => b.rating.average - a.rating.average);
            let topTwo = topRatedEps.slice(0, 2);
            settopTwoEps(topTwo);
            setepisodeLoading(false);
        }
    }, [episodes]);

    
    


    return (
        <div className='all-episode'>
            <Header onPage={true} />
            <div className="all-episode-banner" style={banner ? { backgroundImage: `url(${banner})` } : {}} >
                <div className="content-wrapper">
                    <div className="all-episode-intro">
                        <Link to={`/${id}/details`}>
                            <div className="all-episode-poster" style={poster ? { backgroundImage: `url(${poster})` } : { backgroundColor: 'gray' }}></div>
                        </Link>
                        <div className="all-episode-details">
                            <Link to={`/${id}/details`}>
                                <span id='all-episode-intro-title'>
                                    {details?.name || "N/A"}
                                </span>
                            </Link>
                            <span id='all-episode-static-title'>Episode List</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="all-episode-content">

                <div className="all-episode-content-top-rated-content">
                    {topTwoEps.length > 0 ? topTwoEps.map(item => (
                        <div 
                        className="all-episode-content-top-rated-card" 
                        key={item.id}
                        onClick={() => {
                            
                            setactiveSeason(item.season);
            
                            // Scroll to the episode after a short delay to allow the season toggle to take effect
                            setTimeout(() => {
                                const element = document.getElementById(`episode-${item.id}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                
                                    element.classList.add('highlight');
                                    setTimeout(() => {
                                        element.classList.remove('highlight');
                                    }, 2000);
                                }
                            }, 300);
                        }}
                        >
                            <div className="polygon-shape-title">TOP-RATED</div>
                            <div className="top-rated-eps-airdate">{item.airdate}</div>
                            <div className="top-rated-eps-number">
                                {`S${item.season}.E${item.number} ${item.name ? ` | ${item.name}` : ""}`}
                            </div>
                            {item.summary ? <div className="top-rated-eps-summary-text" dangerouslySetInnerHTML={{ __html: item?.summary || "" }} /> : "N/A"}
                            {item?.rating?.average ?
                                <div className="top-rated-eps-ratings">
                                    <i className="me-2 bi bi-star-fill text-warning"></i>
                                    {item?.rating?.average || "N/A"}
                                </div>
                                : ""}
                        </div>
                    )) : ""}
                </div>

                <div className="all-episode-content-header">
                    <div className="all-episode-content-header-title">
                        Seasons
                    </div>
                    <div className="all-episode-content-header-seasons">
                        {/* {episodes? episodes[episodes.length -1].season : ""} */}
                        {totalSeasons ? renderSeasons(totalSeasons) : ""}
                    </div>
                </div>
                <div className={`all-episode-content-episodes ${fadeIn ? 'fade-in' : ''}`}>
                    {!episodeLoading && loadedEpisode
                        .filter(item => item.season === activeSeason)
                        .map(item => (
                            <div className="all-episode-content-episode-card" key={item.id} id={`episode-${item.id}`} >
                                <div className="all-episode-content-episode-image" style={episodes ? { backgroundImage: `url(${item?.image?.original || ""})` } : {}}></div>
                                <div className="all-episode-content-episode-data">
                                    <div className="aec-episode-name">
                                        {`S${item.season}.E${item.number} | ${item.name}`}
                                        <span className='airdate'>{item?.airdate || "Airdate : N/A"}</span>
                                    </div>
                                    {item.summary ? <div className="aec-episode-summary" dangerouslySetInnerHTML={{ __html: item?.summary || "" }} /> : "N/A"}
                                    {item?.rating?.average ?
                                        <div className="aec-episode-ratings">
                                            <i className="me-2 bi bi-star-fill text-warning"></i>
                                            {item?.rating?.average || "N/A"}
                                        </div>
                                        : ""}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default AllEpisode
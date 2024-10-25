import React, { useContext, useEffect, useState } from 'react'
import "../css/Episodes.css"
import { Link } from 'react-router-dom'
import { Context } from '../context/context'
function Episodes({id}) {
    const [loadedEpisode, setloadedEpisode] = useState([]);
    const [episodeLoading, setepisodeLoading] = useState(true);
    const { episodes } = useContext(Context);

    useEffect(() => {
        setloadedEpisode([]);
        if (episodes.length > 0) {
            setloadedEpisode(episodes);
            setepisodeLoading(false);
        }
    }, [episodes]);

    return (
        <div className='episodes'>
            <Link to = {`/${id}/AllEpisodes`}>
                <div className="episode-header">
                    <h3 id='episode-h3'>Episodes</h3>
                    <span id='epi-num'>
                        {episodes ? `(${episodes.length})` : ""}
                    </span>
                    <h2 id='go-to-icon'><i className="bi bi-chevron-right"></i></h2>
                </div>
            </Link>
            <div className="episode-list">
                {!episodeLoading && loadedEpisode.map(item => (
                    <div className="episode-card" key={item.id} style={{ backgroundImage: `url(${item.image?.original || ""})` }}>
                        <div className="overlay"></div>
                        <div className="episode-number">
                            <h6>{`S${item.season}xE${item.number} | ${item.name}`}</h6>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Episodes
import React from 'react'
import "../css/ExternalLinks.css"
function ExternalLinks({ OfficialSite, TVmaze, externals }) {

    return (
        <div className='links-box'>
            {OfficialSite && (
                <a href={OfficialSite}>
                    <div className="external-link">
                        Official Site
                    </div>
                </a>
            )}

            {TVmaze && (
                <a href={TVmaze}>
                    <div className="external-link">
                        TVmaze
                    </div>
                </a>
            )}

            {externals?.imdb && (
                <a href={`https://www.imdb.com/title/${externals.imdb}`}>
                    <div className="external-link">
                        IMDb
                    </div>
                </a>
            )}

            {externals?.tvrage && (
                <a href={`https://www.tvrage.com/shows/id-${externals.tvrage}`}>
                    <div className="external-link">
                        TVRage
                    </div>
                </a>
            )}



        </div>
    )
}

export default ExternalLinks
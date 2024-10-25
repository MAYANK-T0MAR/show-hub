import React from 'react'
import '../css/MovieCards.css'

function MovieCards({image, name}) {
    const truncatedName = name.length > 20 ? name.slice(0, 20) + '...' : name;
    return (
        <div className="card">
            {image!=null?(
                // <img className="card-img-top" src= {image} alt="Card image cap" />
                <div className="default-img" style={{ backgroundImage: image ? `url(${image})` : "" }}></div>
            ) : (
                <div className="default-img">
                    <p>No Image <br />Available</p>
                </div>
            )}
            
            <div className="card-body">
                <p className="card-text">
                    {truncatedName}
                </p>
            </div>
        </div>
    )
}

export default MovieCards
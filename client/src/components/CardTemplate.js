import React from 'react'
import '../css/CardTemplate.css'

function CardTemplate({ heading, description, image }) {
    return (
        <div className="welcome-card">
            <div className="icon">
                <div className="icon-background">
                    <i className={`${image} icon-image`}></i>
                </div>
                
            </div>
            <div className="card-content">
                <div className="card-title">
                    <h6>{heading}</h6>
                </div>
                <div className="card-description">
                    {description}
                </div>
            </div>
        </div>
    )
}

export default CardTemplate
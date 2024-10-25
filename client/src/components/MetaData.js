import React from 'react'
import "../css/MetaData.css"
function MetaData({title, data}) {
    return (
        <div className="entry">
            <div className="data-title">
                {title}
            </div>
            <div className="entry-data">
                {data}
            </div>
        </div>
    )
}

export default MetaData
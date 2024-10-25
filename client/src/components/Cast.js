import React, { useContext, useEffect, useState } from 'react'
import "../css/Cast.css"
import { Context } from '../context/context'
import { Link } from 'react-router-dom';

function Cast() {
    const { cast } = useContext(Context);
    const [loadedCast, setloadedCast] = useState([]);
    const [castLoading, setcastLoading] = useState(true);
    const [castExpanded, setcastExpanded] = useState(false);
    useEffect(() => {
        setloadedCast([]);
        if (cast.length > 0) {
            setloadedCast(cast);
            setcastLoading(false);
        }
    }, [cast])

    return (
        <div className='cast'>
            <a href="">
                <div className="cast-header">
                    <h3 id='cast-h3'>Cast</h3>
                    <h2 id='cast-go-to-icon'><i className="bi bi-chevron-right"></i></h2>
                </div>
            </a>
            <div className={`cast-list ${castExpanded ? "cast-list--expanded" : ""}`}>
                {/* <div className={`cast-list ${castExpanded ? "cast-list--expanded" : ""}`}></div>     */}
                {!castLoading && loadedCast.map(item => (
                    <div className="cast-item" key={item.person.id}>
                        <Link to={`/person/${item.person.id}`} >
                            <div className="person-pic" style={item?.person?.image?.original ? { backgroundImage: `URL(${item?.person?.image?.original})` } : { backgroundColor: 'gray' }} ></div>
                        </Link>
                        <div className="person-data">
                            <div id='person-name'>{item.person.name}</div>
                            <span id='character-name'>{item.character.name}</span>
                        </div>
                    </div>
                ))}
            </div>
            {!castLoading && (
                loadedCast.length > 10 ?
                    <div className="show-more" onClick={() => setcastExpanded(!castExpanded)}>
                        {`Show ${castExpanded ? "Less" : "More"}`}
                    </div>
                    : ""
            )}
        </div>
    )
}

export default Cast
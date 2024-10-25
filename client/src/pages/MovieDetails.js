import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "../css/MovieDetails.css"
import MetaData from '../components/MetaData';
import ExternalLinks from '../components/ExternalLinks';
import Header from '../components/Header';
import { Context } from '../context/context';
import Episodes from '../components/Episodes';
import Cast from '../components/Cast';
import ListEditor from '../components/ListEditor';
import { DbContext } from '../context/DbContext';
import GlobalAlert from '../components/GlobalAlert';
import SocialPosts from '../components/SocialPosts';


function MovieDetails() {
    const { details, banner, episodes, seasons, cast, getDetails } = useContext(Context);
    document.title = `${details?.name || 'Show Details'} - ShowHub`;
    const { authenticated } = useContext(DbContext);
    const { id } = useParams();
    const [descriptionExpanded, setdescriptionExpanded] = useState(false);
    const [showListEditor, setshowListEditor] = useState(false);
    const [alertShowing, setAlertShowing] = useState(false);
    const closeListEditor = () => setshowListEditor(false);
    const openListEditor = () => setshowListEditor(true);
    useEffect(() => {
        getDetails(id);
    }, [id])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [details?.image?.original || ""]);
    useEffect(() => {
        authenticated ? setAlertShowing(false) : setAlertShowing(true);
    }, [authenticated])




    return (
        <div>
            <div className="details-header">
                <Header onPage={true} />
                {showListEditor && (authenticated ?
                    <ListEditor
                        closeListEditor={closeListEditor}
                        poster={details?.image?.original || ""}
                        banner={banner ? banner : ""}
                        title={details?.name || "Title"}
                        showId={id}
                    />
                    :
                    <GlobalAlert message={"Please Login to use lists"} showAlert={alertShowing} />
                )}
                <div className="main-banner" style={{ backgroundImage: banner ? `url(${banner})` : "" }}>
                    <div className="shadow"></div>
                </div>
                <div className="details-intro">
                    <div className="movie-poster">
                        <img src={details?.image?.original || ""} alt="" />
                        <div id='btn-below-poster' className="btn btn-primary mt-3 w-100" onClick={openListEditor} >Add to List</div>
                    </div>
                    <div className="description">
                        <div className="meta-box-top">
                            <MetaData title="Ratings" data={details?.rating?.average || "N/A"} />
                            <MetaData title="Confirmed Seasons" data={seasons?.length || "N/A"} />
                            <MetaData title="Total Episodes" data={episodes?.length || "N/A"} />
                            <MetaData title="Language" data={details?.language || "N/A"} />
                            <MetaData title="Genres" data={details?.genres?.join(", ") || "N/A"} />
                            <MetaData title="Status" data={details?.status || "N/A"} />
                            <MetaData title="Average Runtime" data={`${details?.averageRuntime} min` || "N/A"} />
                            <MetaData title="Premiered" data={details?.premiered || "N/A"} />
                            <MetaData title="Ended" data={details?.ended || "N/A"} />
                        </div>
                        <h3>{details?.name || "Title"}</h3>
                        <div className={`descritption-text ${descriptionExpanded ? "description-text--expanded" : ""}`} onClick={() => setdescriptionExpanded(!descriptionExpanded)} dangerouslySetInnerHTML={{ __html: details?.summary || "" }} />
                        <ExternalLinks
                            OfficialSite={details?.officialSite || ""}
                            TVmaze={details?.url || ""}
                            externals={details?.externals || {}}
                        />
                    </div>
                    <div id='btn-with-poster' className="btn btn-primary w-100" onClick={openListEditor} >Add to List</div>

                </div>
                <div id='name-below-poster'>
                    <h3>{details?.name || "Title"}</h3>
                </div>
                <div id='description-below'>
                    <p className='fs-4'>Summary</p>
                    <div className={`descritption-text ${descriptionExpanded ? "description-text--expanded" : ""}`} onClick={() => setdescriptionExpanded(!descriptionExpanded)} dangerouslySetInnerHTML={{ __html: details?.summary || "" }} />
                    <ExternalLinks
                        OfficialSite={details?.officialSite || ""}
                        TVmaze={details?.url || ""}
                        externals={details?.externals || {}}
                    />
                </div>
            </div>

            <div className="meta-data">
                <div className="meta-box">
                    <MetaData title="Ratings" data={details?.rating?.average || "N/A"} />
                    <MetaData title="Confirmed Seasons" data={seasons?.length || "N/A"} />
                    <MetaData title="Total Episodes" data={episodes?.length || "N/A"} />
                    <MetaData title="Language" data={details?.language || "N/A"} />
                    <MetaData title="Genres" data={details?.genres?.join(", ") || "N/A"} />
                    <MetaData title="Status" data={details?.status || "N/A"} />
                    <MetaData title="Average Runtime" data={`${details?.averageRuntime} min` || "N/A"} />
                    <MetaData title="Premiered" data={details?.premiered || "N/A"} />
                    <MetaData title="Ended" data={details?.ended || "N/A"} />
                </div>
            </div>
            <div className="episode-page-content">
                <Episodes id={id} />
                {cast.length !== 0 ? <Cast /> : ""}



            </div>

            <SocialPosts showId = {id} showBanner = {banner? banner : ""} />
        </div>
    )
}

export default MovieDetails
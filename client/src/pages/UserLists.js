import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "../css/user-css/UserLists.css"
import Header from '../components/Header'
import ListEditor from '../components/ListEditor';
import UserProfileHeader from '../components/user-components/UserProfileHeader'
import { useParams } from 'react-router-dom';
import { DbContext } from '../context/DbContext';
import GlobalAlert from '../components/GlobalAlert';

function UserLists() {

  const { username } = useParams();
  document.title = `${username || ''}'s lists - ShowHub`;
  
  const { authenticated, fetchProfile, profile, isOwner } = useContext(DbContext);
  const [activeFilter, setactiveFilter] = useState("All");
  const [alertShowing, setAlertShowing] = useState(false);
  const [showListEditor, setshowListEditor] = useState(false);
  const [posterForListEditor, setPosterForListEditor] = useState("");
  const [bannerForListEditor, setBannerForListEditor] = useState("");
  const [titleForListEditor, setTitleForListEditor] = useState("");
  const [showIdForListEditor, setShowIdForListEditor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const closeListEditor = () => setshowListEditor(false);
  const openListEditor = (poster, banner, title, showId) => {
    setPosterForListEditor(poster);
    setBannerForListEditor(banner);
    setTitleForListEditor(title);
    setShowIdForListEditor(showId);
    setshowListEditor(true);
  };

  const applyFilter = (filter) => {
    setactiveFilter(filter);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    fetchProfile(username);
  }, [username]);






  // useEffect(() => {
  //   console.log(isOwner);

  // }, [isOwner])

  return (

    <div className='user-lists'>
      <Header onPage={true} />
      {showListEditor && (authenticated ?
        <ListEditor
          closeListEditor={closeListEditor}
          poster={posterForListEditor || ""}
          banner={bannerForListEditor ? bannerForListEditor : ""}
          title={titleForListEditor || "Title"}
          showId={showIdForListEditor}
        />
        :
        <GlobalAlert message={"Please Login to use lists"} showAlert={alertShowing} />
      )}
      <UserProfileHeader currentPage={"Lists"}/>
      <div className="list-content-container">
        <div className="list-container">
          <div className="filter-wrapper">
            <div className="show-filter-search">
              <i className="bi bi-search show-filter-search-icon"></i>
              <input
                className='show-filter-search-input'
                type="text"
                placeholder='Search'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="filter-group">
              <div id='filter-group-title'>Lists</div>
              <div
                onClick={() => applyFilter("All")}
                className={`filter-list-name ${activeFilter === "All" ? 'filter-active' : ''}`}
              >
                All
              </div>
              {profile && profile.userLists.length > 0 && profile.userLists
                .filter(item => item.shows.length > 0)
                .map(item => (
                  <div
                    onClick={() => applyFilter(item.listName)}
                    className={`filter-list-name ${activeFilter === item.listName ? 'filter-active' : ''}`}
                  >
                    <span>{item.listName}</span>
                    <span>{item.shows.length}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="list-container-lists">



            {profile && profile.userLists.length > 0 && profile.userLists
              .filter(item => (activeFilter === 'All' || item.listName === activeFilter) && item.shows.some(show => show?.title?.toLowerCase().includes(searchTerm.toLowerCase())))
              .map(item => (
                <div className="list-wrap">
                  <div className="list-section-name">{item.listName}</div>

                  <div className="list-section">
                    <div className="list-section-header">
                      <div className="spacer-boy"></div>
                      <div className="list-header-title">Title</div>
                      <div className="list-header-score">Score</div>
                      <div className="list-header-progress">Progress</div>
                    </div>

                    {item.shows.length > 0 && item.shows
                      .filter(show => show.title.toLowerCase().includes(searchTerm))
                      .map(show => (
                        <div className="list-section-entries">
                          <div className="section-entry-poster">
                            <div className="section-image" style={{ backgroundImage: show?.poster ? `url(${show?.poster})` : "" }}>
                              {isOwner &&
                                <div className="list-entry-edit" onClick={() => openListEditor(show?.poster, show?.banner, show?.title, show?.showId)}>
                                  <i className="bi bi-three-dots"></i>
                                </div>
                              }
                            </div>
                            <div className="section-image-overlay" style={{ backgroundImage: show?.poster ? `url(${show?.poster})` : "" }}></div>
                          </div>

                          <div className="list-header-title onComp"><Link to={`/${show.showId}/details`}>{show?.title || ""}</Link></div>

                          <div className="list-header-score onComp">
                            <span>{show?.score || ""}</span>
                            {show?.score && <i className="bi bi-star-fill rating-icon"></i>}
                          </div>

                          <div className="list-header-progress onComp">{show?.progress[2] !== " " || show?.progress[show.progress.length - 1] !== ":" ? show.progress : "0"}</div>

                          <div className="on-mobile-content">
                            <div className="on-mobile-list-header-title"><Link to={`/${show.showId}/details`}>{show?.title || ""}</Link></div>
                            <div className="on-mobile-score-prog-wrapper">
                              {show?.score &&
                                <div className="on-mobile-list-header-score">
                                  <span>{show?.score ? "Score: " : ""}</span>
                                  <span>{show?.score || ""}</span>
                                  {show?.score && <i className="bi bi-star-fill rating-icon"></i>}
                                </div>
                              }
                              <div className={`on-mobile-list-header-progress ${show?.score ? 'right' : 'left'}`}>
                                <span>Progress: </span>
                                {show?.progress[2] !== " " || show?.progress[show.progress.length - 1] !== ":" ? show.progress : "0"}
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}

                  </div>
                </div>
              ))}


          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLists
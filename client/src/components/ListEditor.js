import React, { useContext, useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import { Input } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import "../css/ListEditor.css"
import { DbContext } from '../context/DbContext';

const { TextArea } = Input;

function ListEditor({ closeListEditor, poster, banner, title, showId }) {
    const { token, authenticated } = useContext(DbContext);
    const [isVisible, setIsVisible] = useState(false);
    const [listExpand, setlistExpand] = useState(false);
    const [privateListExpanded, setPrivateListExpanded] = useState(false);
    const [selectedStatus, setselectedStatus] = useState("Plan to Watch");
    const [creatingNewList, setcreatingNewList] = useState(false);
    const [newList, setnewList] = useState("");
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);
    const [notes, setNotes] = useState("");
    const [listIsPrivate, setListIsPrivate] = useState(false);
    const [entryIsPrivate, setEntryIsPrivate] = useState(false);
    const [seasonProgress, setSeasonProgress] = useState("");
    const [episodeProgress, setEpisodeProgress] = useState("");
    const [seasonHasContent, setSeasonHasContent] = useState(false);
    const [episodeHasContent, setEpisodeHasContent] = useState(false);
    const [listFound, setlistFound] = useState(false);
    const defaultList = ["Plan to Watch", "Watching", "Completed"];
    const [availableLists, setavailableLists] = useState(null);
    // const [otherLists, setotherLists] = useState(null);
    const progress = `S:${seasonProgress} | E:${episodeProgress}`;

    const [defaultListData, setdefaultListData] = useState(null);
    const [otherListData, setotherListData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const openDeleteConfirmation = (e) => {
        e.preventDefault();
        setShowDelete(true);
    }


    const listData = {
        showId: showId,
        title: title,
        poster: poster,
        banner: banner,
        listname: selectedStatus,
        creatingNewList: creatingNewList,
        newList: newList,
        score: rating,
        progress: progress,
        startDate: startDate,
        finishDate: finishDate,
        listIsPrivate: listIsPrivate,
        entryIsPrivate: entryIsPrivate,
        notes: notes,
    }

    const resetState = () => {
        setRating(null);
        setSeasonProgress("");
        setEpisodeProgress("");
        setStartDate(null);
        setFinishDate(null);
        setEntryIsPrivate(false);
        setListIsPrivate(false);
        setNotes("");
    }


    const updateListData = (data) => {
        if (data) {
            setselectedStatus(data?.listName || selectedStatus);
            setRating(data?.showData?.score || null);

            const formatDate = (date) => (date ? dayjs(date) : null);
            setStartDate(data?.showData?.startDate ? formatDate(data.showData.startDate) : null);
            setFinishDate(data?.showData?.finishDate ? formatDate(data.showData.finishDate) : null);

            if (data?.showData?.progress) {
                const progressParts = data.showData.progress.split(' | ');
                if (progressParts.length === 2) {
                    const [season, episode] = progressParts.map(part => part.split(':')[1]?.trim());
                    setSeasonProgress(season || "");
                    setEpisodeProgress(episode || "");
                }
            }

            setListIsPrivate(data?.private ?? false);
            setEntryIsPrivate(data?.showData?.private ?? false);

            setNotes(data?.showData?.notes || "");
        } else {
            resetState();
        }
    }

    const updateList = async () => {
        if (authenticated) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/show-lookup/${showId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response?.data;

                if (response.status === 200) {
                    setlistFound(true);
                    const defaultListData = data.defaultListData || null;
                    const otherListData = data.otherLists || [];

                    setdefaultListData(defaultListData);
                    setotherListData(otherListData);

                    // Ensure that updateListData is called after the state has been updated
                    if (selectedStatus === defaultListData?.listName) {
                        updateListData(defaultListData);
                    } else {
                        const matchingCustomList = otherListData.find(list => list.listName === selectedStatus);
                        if (matchingCustomList) {
                            updateListData(matchingCustomList);
                        } else {
                            resetState(); // Reset the state if no matching list is found
                        }
                    }

                }


            } catch (error) {
                console.error('Error fetching list data :', error);
            }
        }
    }


    useEffect(() => {
        updateList();
        const fetchLists = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/list-lookup`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setavailableLists(response.data);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        fetchLists();
    }, [showId])

    // useEffect(() => {
    //     if (selectedStatus && availableLists) {
    //         const matchingCustomList = availableLists.find(list => list.listName === selectedStatus);
    //         if (matchingCustomList) {
    //             updateListData(matchingCustomList);
    //         } else {
    //             console.log("167 calling the resetState");
    //             resetState(); // Reset the state if no matching list is found
    //         }
    //     } else {
    //         console.log("171 calling the resetState");
    //         resetState();
    //     }
    // }, [availableLists, selectedStatus])



    useEffect(() => {
        updateListData(defaultListData)
    }, [defaultListData])



    // useEffect(() => {
    //     if (selectedStatus && (defaultListData || otherListData)) {
    //         if (selectedStatus === defaultListData?.listName) {
    //             updateListData(defaultListData);
    //         } else {
    //             const matchingCustomList = otherListData.find(list => list.listName === selectedStatus);
    //             if (matchingCustomList) {
    //                 updateListData(matchingCustomList);
    //             } else {
    //             console.log("197 calling the resetState");
    //                 resetState(); // Reset the state if no matching list is found
    //             }
    //         }
    //     } else {
    //         console.log("202 calling the resetState");
    //         resetState(); // Reset if no data is available
    //     }
    // }, [selectedStatus, defaultListData, otherListData]);





    useEffect(() => {
        if (selectedStatus) {
            if (defaultListData && selectedStatus === defaultListData?.listName) {
                // If selectedStatus matches the default list
                updateListData(defaultListData);
            } else if (otherListData && otherListData.length > 0) {
                // Check other custom lists if no match with default list
                const matchingCustomList = otherListData.find(list => list.listName === selectedStatus);
                if (matchingCustomList) {
                    updateListData(matchingCustomList);
                } else if (availableLists && availableLists.length > 0) {
                    // If no match in custom lists, check available lists
                    const matchingAvailableList = availableLists.find(list => list.listName === selectedStatus);
                    if (matchingAvailableList) {
                        updateListData(matchingAvailableList);
                    } else {
                        resetState(); // Reset if no match found in default, custom, or available lists
                    }
                } else {
                    resetState(); // Reset if no other lists found
                }
            } else if (availableLists && availableLists.length > 0) {
                // Check available lists if default and custom lists are not found
                const matchingAvailableList = availableLists.find(list => list.listName === selectedStatus);
                if (matchingAvailableList) {
                    updateListData(matchingAvailableList);
                } else {
                    resetState();
                }
            } else {
                resetState();
            }
        } else {
            resetState(); // Reset if no selectedStatus is set
        }
    }, [selectedStatus, defaultListData, otherListData, availableLists]);



    const startDateChange = (date, dateString) => {
        setStartDate(date ? dayjs(date) : null);


    };

    const finishDateChange = (date, dateString) => {
        setFinishDate(date ? dayjs(date) : null);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };


    const postShowToList = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/add-show`,
                listData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request header
                    }
                }
            );

            console.log('Success:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const deletShowFromList = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/remove-show/${listData.listname}/${listData.showId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request header
                    }
                }
            );

            console.log('Success:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        creatingNewList && newList && setselectedStatus(newList);
    }, [newList])



    useEffect(() => {
        setSeasonHasContent(seasonProgress !== "");
        if (seasonProgress < 0) {
            setSeasonProgress(0);
        }

    }, [seasonProgress])

    useEffect(() => {
        setEpisodeHasContent(episodeProgress !== "");
        if (episodeProgress < 0) {
            setEpisodeProgress(0);
        }

    }, [episodeProgress])


    useEffect(() => {
        console.log("default list data : ");
        console.log(defaultListData);


    }, [defaultListData])




    useEffect(() => {
        setIsVisible(true);
    }, [])

    return (
        <div className={`list-editor-wrapper ${isVisible ? 'active' : ''}`} onClick={closeListEditor}>
            <div className="list-editor-dialog" onClick={(e) => {
                e.stopPropagation();
                setlistExpand(false);
                setPrivateListExpanded(false);
            }}>
                <div className="dialog-header" style={{ backgroundImage: banner ? `url(${banner})` : "" }} >
                    <div className="dialog-header-bg-shadow">
                        <div className="dialog-poster">
                            <img src={poster} alt="" />
                        </div>

                        <div className="dialog-action">
                            <div className="dialog-title">
                                {title}
                            </div>
                            <div className={`btn btn-primary mb-1 ${loading ? 'disabled' : ''}`} onClick={!loading ? postShowToList : null}>{loading ? 'Saving...' : 'Save'}</div>

                        </div>
                    </div>
                </div>

                <div className="dialog-form">

                    {/* Status Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-status">
                        <div className="dform-labels">
                            List
                        </div>
                        <div className="status-input">
                            <div className="selected-status">
                                <div id="selected-option" onClick={(e) => {
                                    e.stopPropagation();
                                    setlistExpand(!listExpand);
                                }}>
                                    {creatingNewList ?
                                        <input
                                            type="text"
                                            className='new-list-input'
                                            placeholder='Enter custom list name'
                                            value={newList}
                                            onChange={(e) => setnewList(e.target.value)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        />
                                        : <span>{selectedStatus}</span>}
                                    <div className={`status-down-arrow ${listExpand ? 'rotate' : ''}`}>
                                        <i className="bi bi-chevron-down"></i>
                                    </div>
                                </div>
                                <div className={`dform-list ${listExpand ? 'expanded' : ''}`}>
                                    {defaultList.map((item) => (
                                        <div
                                            className="dform-list-option"
                                            onClick={() => {
                                                setselectedStatus(item);
                                                setcreatingNewList(false);
                                            }}
                                        >
                                            {item} {defaultListData?.listName.includes(item) && "✓"}
                                        </div>
                                    ))}

                                    {availableLists && availableLists.length > 0 &&
                                        <div className="dform-custom-lists">
                                            <div id='custom-list-title'>Custom Lists</div>
                                            {availableLists.map((item) => (
                                                <div
                                                    className="dform-list-option"
                                                    onClick={() => {
                                                        setselectedStatus(item.listName);
                                                        setcreatingNewList(false);

                                                    }}
                                                >
                                                    {item.listName} {otherListData?.some(list => list.listName.includes(item.listName)) && "✓"}
                                                </div>
                                            ))}
                                        </div>
                                    }

                                    <div
                                        className="dform-list-action"
                                        onClick={() => {
                                            setnewList("");
                                            setcreatingNewList(true);
                                        }}
                                    >
                                        ...or create a new one
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/*-----------------------------------------------------------------*/}



                    {/* Score Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-score">
                        <div className="dform-labels">
                            Ratings
                        </div>
                        <div className="dform-input" id='rating-input'>
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;

                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() => {
                                                rating == ratingValue ? setRating(null) : setRating(ratingValue)

                                            }} // Set rating on click
                                            style={{ display: "none" }} // Hide the radio button
                                        />
                                        <i
                                            className={`bi ${ratingValue <= (hover || rating) ? "bi-star-fill" : "bi-star"}`}
                                            id={`star${ratingValue}`}
                                            style={{ fontSize: "1.2rem", transition: "color 0.4s", color: ratingValue <= (hover || rating) ? "#ffc107" : "rgb(154 154 157)", cursor: "pointer" }}
                                            onMouseEnter={() => setHover(ratingValue)} // Highlight stars on hover
                                            onMouseLeave={() => setHover(null)} // Reset hover state on mouse leave

                                            // Handle touch for mobile
                                            onTouchStart={() => setHover(ratingValue)}
                                            onTouchEnd={() => setHover(null)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    {/*----------------------------------------------------------------*/}



                    {/* Progress Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-progress">
                        <div className="dform-labels">
                            Progress
                        </div>
                        <div className="dform-input" id='progress-box'>
                            <div className="progress-box-input-group">
                                <input
                                    type="number"
                                    className="progress-box-input"
                                    value={seasonProgress}
                                    onChange={(e) => setSeasonProgress(e.target.value)}
                                />
                                <label className={`progress-box-label ${seasonHasContent ? 'hasContent' : ''}`}>Season</label>
                            </div>

                            <div className="progress-box-input-group">
                                <input
                                    type="number"
                                    className="progress-box-input"
                                    value={episodeProgress}
                                    onChange={(e) => setEpisodeProgress(e.target.value)}
                                />
                                <label className={`progress-box-label ${episodeHasContent ? 'hasContent' : ''}`}>Episode</label>
                            </div>
                        </div>
                    </div>
                    {/*------------------------------------------------------------------ */}



                    {/* Start date Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-start">
                        <div className="dform-labels">
                            Start Date
                        </div>
                        <div className="dform-input">
                            <DatePicker
                                onChange={startDateChange}
                                value={startDate}
                                format="DD/MM/YYYY"
                                style={{ width: '100%', height: '100%', backgroundColor: '#edf1f5', border: 'none' }}
                            />
                        </div>
                    </div>
                    {/*---------------------------------------------------------------------*/}



                    {/* Finish date Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-finish">
                        <div className="dform-labels">
                            Finish Date
                        </div>
                        <div className="dform-input">
                            <DatePicker
                                onChange={finishDateChange}
                                value={finishDate}
                                format="DD/MM/YYYY"
                                style={{ width: '100%', height: '100%', backgroundColor: '#edf1f5', border: 'none' }}
                            />
                        </div>
                    </div>
                    {/*----------------------------------------------------------------------*/}



                    {/* Private Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-private">
                        <div className="dform-labels">
                            Private
                        </div>
                        <div className="dform-input private-input" onClick={(e) => {
                            e.stopPropagation();
                            setPrivateListExpanded(!privateListExpanded);
                        }}>
                            <span>List and Entry visibility</span>
                            <div className={`status-down-arrow ${privateListExpanded ? 'rotate' : ''}`}>
                                <i className="bi bi-chevron-down"></i>
                            </div>
                        </div>

                        <div className={`dform-list --pvtList ${privateListExpanded ? 'expanded' : ''}`}>
                            <div className="dform-list-option" onClick={(e) => {
                                e.stopPropagation();
                                setListIsPrivate(!listIsPrivate);
                            }}>
                                <input type="checkbox" checked={listIsPrivate} onChange={(e) => setListIsPrivate(!listIsPrivate)} />
                                <span>Make List Private</span>

                            </div>

                            <div className="dform-list-option" onClick={(e) => {
                                e.stopPropagation();
                                setEntryIsPrivate(!entryIsPrivate);
                            }}>
                                <input type="checkbox" checked={entryIsPrivate} onChange={(e) => setEntryIsPrivate(!entryIsPrivate)} />
                                <span>Make Entry Private</span>
                            </div>

                        </div>

                    </div>
                    {/*------------------------------------------------------------------*/}



                    {/* Notes Field starts here -------------------------------------- */}
                    <div className="dform-fields dform-notes" id='notes-input-box'>
                        <div className="dform-labels">
                            Notes
                        </div>
                        <div className="dform-input" id='notes-input'>
                            <TextArea
                                value={notes}
                                onChange={handleNotesChange}
                                autoSize={{ minRows: 1 }} // Adjust min and max rows as needed
                                size='large'
                                style={{
                                    width: '100%',
                                    resize: 'none',       // Prevent manual resizing
                                }}
                                className='notes-textarea'
                            />
                        </div>
                    </div>
                    {/*----------------------------------------------------------------*/}



                    {/* Action Field starts here -------------------------------------- */}
                    {listFound &&
                        <div className="dform-fields dform-action">
                            <div className="btn btn-secondary" onClick={(e) => openDeleteConfirmation(e)}>Delete</div>
                        </div>
                    }
                    {/*-----------------------------------------------------------------*/}

                </div>

                <div className={`delete-confirmation ${showDelete ? 'show-delete' : ''}`}>
                    <div className="delete-card">
                        <div className="dc-title">Delete <span className='dc-highlighted'>{listData.title}</span> from <span className='dc-highlighted'>{listData.listname}</span> ?</div>
                        <div className="dc-actions">
                            <button class="btn btn-outline-secondary"onClick={()=> setShowDelete(false)}>Cancel</button>
                            <button class={`btn btn-danger ${loading ? 'disabled' : ''}`} onClick={!loading ? deletShowFromList : null}>{loading ? 'loading...' : 'Delete'}</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ListEditor
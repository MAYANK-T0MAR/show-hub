import React, { useContext, useEffect, useState } from 'react';
import { Input } from 'antd';
import "../css/ForumEditor.css";
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import RichTextEditor from '../components/RichTextEditor';
import axios from 'axios';
import { DbContext } from '../context/DbContext';

const { TextArea } = Input;

function ForumEditor() {

    document.title = "ShowHub - Forum Editor";
    const { id } = useParams();
    const { token } = useContext(DbContext);
    const [onShowForum, setOnShowForum] = useState({ name: '', id: null });
    const [query, setquery] = useState("");
    const [loading, setloading] = useState(false);
    const [data, setData] = useState(null);
    const [forumTitle, setForumTitle] = useState("");
    const [forumDescription, setforumDescription] = useState("");
    const [categories, setCategories] = useState([
        { name: "General", selected: false },
        { name: "Gaming", selected: false },
        { name: "Music", selected: false },
        { name: "Anime", selected: false },
        { name: "Upcoming", selected: false },
        { name: "News", selected: false },
        { name: "Recommendations", selected: false },
        { name: "Bugs & Feedback", selected: false },
        { name: "Favourite Shows", selected: false },
        { name: "Underrated Shows", selected: false },
        { name: "Show Comparisons", selected: false },
        { name: "Classic TV Shows", selected: false },
        { name: "Iconic Show Lines", selected: false },
        { name: "Release Discussion", selected: false },
        { name: "Currently Watching", selected: false },
        { name: "Binge-Worthy Shows", selected: false },
        { name: "Episode Discussions", selected: false }
    ]);

    const [selectedShowCategories, setSelectedShowCategories] = useState([]);



    const integrateData = () => {
        // Filter categories that have selected: true and assign showId: null
        const selectedCategories = categories
            .filter(category => category.selected)
            .map(category => ({
                name: category.name,
                showId: null
            }));
    
        // Combine the filtered categories and selectedShowCategories
        const combinedData = [...selectedCategories, 
            ...selectedShowCategories.map(item => ({
                name: item.name,
                showId: item.id
            }))
        ];
    
        // Add onShowForum object to the end with renamed id to showId
        if (onShowForum.name && onShowForum.id) {
            combinedData.push({
                name: onShowForum.name,
                showId: onShowForum.id
            });
        }
    
        // Now combinedData contains the integrated result with showId
        return combinedData;
    };
    


    const forumData = {
        title: forumTitle,
        description: forumDescription,
        catagory: integrateData()
    }


    
    


    const handleCatagorySelect = (index) => {
        const updatedCategories = categories.map((category, i) =>
            i === index ? { ...category, selected: !category.selected } : category
        );
        setCategories(updatedCategories);
    };


    const updateSelectedShowCategories = (name, id) => {
        const isAlreadySelected = selectedShowCategories.some(item => item.id === id);

        if (isAlreadySelected) {
            const updatedCategories = selectedShowCategories.filter(item => item.id !== id);
            setSelectedShowCategories(updatedCategories);
        } else {
            const updatedCategories = [...selectedShowCategories, { name, id }];
            setSelectedShowCategories(updatedCategories);
        }
    };



    const handleForumTitleChange = (e) => {
        setForumTitle(e.target.value);
    };


    const descriptionHasMoreThan20Character = () => {
        let contentWithoutSpacesAndTags = forumDescription.replace(/<[^>]*>/g, '').replace(/\s{2,}/g, ' ');
        return contentWithoutSpacesAndTags.length > 20;
    };

    const forumTitleIsLongEnough = () => {
        let validContent = forumTitle.replace(/\s{2,}/g, ' ').replace(/\n/g, '');
        return validContent.length > 20 && validContent.length < 120;
    }


    const getData = async () => {
        setloading(true);
        try {
            let response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            let responseData = await response.json();
            setData(responseData);
            setloading(false);
        } catch (error) {
            console.error(error);

        }

    }

    const showName = async (id) => {
        try {
            let data = await fetch(`https://api.tvmaze.com/shows/${id}`);
            let response = await data.json();
            let name = response.name;
            setOnShowForum({ name: name, id: parseInt(id) });
        } catch (error) {
            console.log(error);
        }
    }




    const postForum = async () => {

        if (descriptionHasMoreThan20Character() && forumTitleIsLongEnough()) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/post-forum`,
                    forumData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                console.log('Success:', response.data);
                window.location.href = `/`;
            } catch (error) {
                console.error('Error:', error);
            }

           

        } 
    }


    useEffect(() => {
        showName(id);
    }, [id])

    useEffect(() => {
        getData();
    }, [query])





    return (
        <div className='forum-editor' >
            <Header />
            <div className="forum-editor-container">
                <div className="fe-summary">
                    <div className="fe-title">Forum Title</div>
                    <div className="fe-input">
                        <TextArea
                            value={forumTitle}
                            onChange={handleForumTitleChange}
                            autoSize={{ minRows: 1 }} // Adjust min and max rows as needed
                            size='large'
                            style={{
                                width: '100%',
                                resize: 'none',       // Prevent manual resizing
                            }}
                            className='notes-textarea'
                            placeholder='Write Thread Title...'
                        />
                    </div>
                    <div className="fe-suggestion">*Must be more than 20 and less than 120 characters</div>
                </div>

                <div className="fe-main-text">
                    <div className="fe-title">Description</div>
                    <div className="fe-input">
                        <RichTextEditor value={forumDescription} setValue={setforumDescription} placeholderValue="Write description..." />
                    </div>
                    <div className="fe-suggestion">*Must be more than 20 characters</div>
                </div>

                <div className="fe-catagories">
                    <div className="fe-title">Catagory</div>
                    <div className="fe-catagory-container">
                        {categories.map((item, index) => (
                            <div className="fe-catagory-item" key={index} onClick={() => handleCatagorySelect(index)}>
                                <input type="checkbox" checked={item.selected} name={item.name} id={item.name} />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="fe-show-catagories">
                    <div className="fe-title">Show Catagories</div>
                    <div className="fe-show-catagory-container">
                        <div className="show-catagory-wrapper">
                            {onShowForum.id && <div className="on-show-forum">{onShowForum.name}</div>}
                            {selectedShowCategories && selectedShowCategories.length > 0 && selectedShowCategories.map(item => (
                                <div className="on-show-forum">
                                    <span>{item.name}</span>
                                    <i className="bi bi-x-circle-fill remove-catag-icon" onClick={() => updateSelectedShowCategories(item.name, item.id)}></i>
                                    
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            className='show-catagory-search'
                            placeholder='Search'
                            value={query}
                            onChange={(e) => setquery(e.target.value)}
                        />
                    </div>
                    {data && data.length > 0 && (
                        <div className="catagory-search-result">
                            {data && data.length > 0 && data.map(item => (
                                <div className="search-item" onClick={() => updateSelectedShowCategories(item?.show?.name, item?.show?.id)}>{item?.show?.name}</div>
                            ))}
                        </div>
                    )}
                </div>



                <div className="fe-post">
                    <div className="fe-post-wrapper">
                        {descriptionHasMoreThan20Character() && forumTitleIsLongEnough() ?
                            <button className='btn btn-primary post-btn' onClick={() => postForum()}>Post</button>

                            :
                            <div className="re-errors">
                                {!descriptionHasMoreThan20Character() &&
                                    <div className="re-error-item">
                                        the description should be 20 characters long
                                    </div>
                                }
                                {!forumTitleIsLongEnough() &&
                                    <div className="re-error-item">
                                        the title must be less than 120 and greater than 20 characters
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForumEditor
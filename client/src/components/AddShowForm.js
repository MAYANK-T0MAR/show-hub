import React, { useState } from 'react';
import axios from 'axios';

const AddShowForm = ({ userId }) => {
    const [listName, setListName] = useState('');
    const [newShow, setNewShow] = useState({ showId: '', score: '', progress: '', startDate: '', finishDate: '', notes: '', private: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/add-show', { userId, listName, newShow });
            alert('Show added successfully');
        } catch (error) {
            console.error('There was an error adding the show:', error);
            alert('Failed to add show');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                List Name:
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name (e.g., 'watching')"
                />
            </label>
            <label>
                Show ID:
                <input
                    type="number"
                    value={newShow.showId}
                    onChange={(e) => setNewShow({ ...newShow, showId: e.target.value })}
                />
            </label>
            {/* Add other fields for score, progress, etc. */}
            <button type="submit">Add Show</button>
        </form>
    );
};

export default AddShowForm;

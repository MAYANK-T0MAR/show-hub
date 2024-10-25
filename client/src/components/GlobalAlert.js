import React from 'react'
import "../css/GlobalAlert.css"

function GlobalAlert({ message, showAlert }) {
    if (!showAlert) return null;

    return (
        <div className="alert-container">
            <div className="alert alert-danger alert-dismissible fade show global-alert" role="alert">
                <i className="bi bi-x-circle-fill text-danger me-2"></i>
                {message}
                <button type="button" className="btn-close alert-close-btn" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    );
}

export default GlobalAlert
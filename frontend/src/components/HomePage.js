import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Ensure the CSS file is in the correct directory

const HomePage = () => {
    return (
        <div className="homepage">
            <h1 className="title">Multimodal Image Search</h1>
            <Link to="/upload" className="upload-button">Upload Images</Link>
            {/* Add some images or content here */}
        </div>
    );
};

export default HomePage;
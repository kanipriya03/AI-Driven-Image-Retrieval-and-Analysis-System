import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './HomePage'; // Ensure Home is imported if needed
import ImagesPage from './ImagesPage';
import Faces from './Faces';
import UploadPage from './UploadPage'; 
import FacesPage from './FacesPage';// Import the UploadPage component

const MainContent = () => {
    return (
        <div style={mainContentStyle}>
            <Routes>
                <Route path="/" element={<Home />} />
            
                <Route path="/images" element={<ImagesPage />} />
                <Route path="/faces" element={<FacesPage />} />
                <Route path="/upload" element={<UploadPage />} /> {/* Route for UploadPage */}
            </Routes>
        </div>
    );
};

const mainContentStyle = {
    marginLeft: '270px',
    padding: '20px'
};

export default MainContent;
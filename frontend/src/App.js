import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import SearchPage from './components/SearchPage';
import ImagesPage from './components/ImagesPage';
import FacesPage  from './components/FacesPage';



import './App.css'; // Assuming there's an App.css file for styling

function App() {
    return (
        <Router>
            <div className="app" style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/images" element={<ImagesPage />} />
                        <Route path="/faces" element={<FacesPage />} />

                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
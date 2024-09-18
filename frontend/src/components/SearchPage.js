
import React, { useState } from 'react';
import axios from 'axios';
import './SearchPage.css'; // Import the CSS file

const SearchApp = () => {
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState({
        captions: [],
        ocr: [],
        objectDetection: [],
        faces: [],
        facesWithBoxes: []
    });

    // Set to keep track of unique image hashes
    const displayedImages = new Set();

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/search', {
                params: { keyword }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    // Helper function to filter out duplicate images
    const filterUniqueImages = (items) => {
        return items.filter(item => {
            const isUnique = !displayedImages.has(item.hash);
            if (isUnique) {
                displayedImages.add(item.hash);
            }
            return isUnique && item.image; // Ensure item.image exists
        });
    };

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter search keyword"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="results-container">
                {/* Display captions with images */}
                <div className="image-grid">
                    {filterUniqueImages(searchResults.captions).map((item) => (
                        <div key={item.hash} className="image-item">
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={`Caption for ${item.filename}`} />
                        </div>
                    ))}
                </div>
                
                {/* Display OCR results with images */}
                <div className="image-grid">
                    {filterUniqueImages(searchResults.ocr).map((item) => (
                        <div key={item.hash} className="image-item">
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={`OCR for ${item.filename}`} />
                        </div>
                    ))}
                </div>
                
                {/* Display object detection results with images */}
                <div className="image-grid">
                    {filterUniqueImages(searchResults.objectDetection).map((item) => (
                        <div key={item.hash} className="image-item">
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={`Object Detection for ${item.filename}`} />
                            {item.objects.map((obj, objIndex) => (
                                <div key={objIndex} className="object-detection-labels">
                                    {/* Add labels or bounding boxes if needed */}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                
                {/* Display faces results with images */}
                <div className="image-grid">
                    {filterUniqueImages(searchResults.faces).map((item) => (
                        <div key={item.hash} className="image-item">
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={`Face for ${item.unique_id}`} />
                        </div>
                    ))}
                </div>
                
                {/* Display faces with boxes results with images */}
                <div className="image-grid">
                    {filterUniqueImages(searchResults.facesWithBoxes).map((item) => (
                        <div key={item.hash} className="image-item">
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={`Face with Box for ${item.unique_id}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchApp;

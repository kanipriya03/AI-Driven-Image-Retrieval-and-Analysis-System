import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FacesPage.css';

const FacesPage = () => {
  const [faces, setFaces] = useState([]);
  const [similarFaces, setSimilarFaces] = useState([]);
  const [selectedFace, setSelectedFace] = useState(null);
  const [viewPhotosMode, setViewPhotosMode] = useState(false);
  const [labels, setLabels] = useState([]); // For storing distinct labels
  const [selectedLabel, setSelectedLabel] = useState(''); // For storing selected label
  const [newLabel, setNewLabel] = useState(''); // For storing new label input
  const [showDropdown, setShowDropdown] = useState(false); // To toggle dropdown visibility
  const [showNewLabelInput, setShowNewLabelInput] = useState(false); // To toggle new label input visibility

  useEffect(() => {
    // Fetch unique faces from the /faces endpoint
    axios.get('http://localhost:5000/faces')
      .then(response => {
        setFaces(response.data);
      })
      .catch(error => {
        console.error('Error fetching faces:', error);
      });
  }, []);

  const handleImageClick = (face) => {
    setSelectedFace(face);
    setViewPhotosMode(false);
    setShowDropdown(false); // Hide dropdown menu when selecting an image
    setShowNewLabelInput(false); // Hide new label input if visible
  };

  const handleViewPhotos = () => {
    if (selectedFace) {
      axios.get('http://localhost:5000/similar-faces')
        .then(response => {
          const similarGroup = response.data.find(group => group[0].unique_id === selectedFace.unique_id);
          setSimilarFaces(similarGroup || []);
          setViewPhotosMode(true);
        })
        .catch(error => {
          console.error('Error fetching similar faces:', error);
        });
    }
  };

  const handleTagFace = () => {
    if (selectedFace) {
      // Fetch distinct labels when "Tag Face" is clicked
      axios.get('http://localhost:5000/labels')
        .then(response => {
          setLabels(response.data);
          setShowDropdown(true); // Show dropdown menu
        })
        .catch(error => {
          console.error('Error fetching labels:', error);
        });
    }
  };

  const handleTagFaceSubmit = () => {
    if (selectedLabel || newLabel) {
      const labelToSave = showNewLabelInput ? newLabel : selectedLabel;

      axios.post('http://localhost:5000/tag-face', {
        unique_id: selectedFace.unique_id,
        label: labelToSave
      })
      .then(response => {
        console.log('Label saved:', response.data);
        // Clear inputs after saving
        setSelectedLabel('');
        setNewLabel('');
        setShowDropdown(false);
        setShowNewLabelInput(false);
      })
      .catch(error => {
        console.error('Error tagging face:', error);
      });
    }
  };

  const handleBackClick = () => {
    setViewPhotosMode(false);
    setSelectedFace(null);
    setShowDropdown(false); // Hide dropdown menu
    setShowNewLabelInput(false); // Hide new label input
  };

  const handleLabelChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewLabelInput(true);
      setSelectedLabel(''); // Clear selected label when new label is being entered
    } else {
      setShowNewLabelInput(false);
      setSelectedLabel(value);
    }
  };

  // Prevent dropdown from closing when clicking inside
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="faces-page">
      <h1>Face Images</h1>
      
      {viewPhotosMode ? (
        <div>
          <button onClick={handleBackClick} className="back-button">Back</button>
          <div className="faces-grid">
            {similarFaces.length > 0 ? (
              similarFaces
                .filter(face => face.image)  // Filter to only display items with valid images
                .map((face) => (
                  <div key={face._id} className="face-item">
                    <img
                      src={`data:image/jpeg;base64,${face.image}`}
                      className="face-image"
                    />
                  </div>
                ))
            ) : (
              <p>No similar faces available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="faces-grid">
          {faces.length > 0 ? (
            faces
              .filter(face => face.image)  // Filter to only display items with valid images
              .map((face) => (
                <div 
                  key={face._id} 
                  className="face-item" 
                  onClick={() => handleImageClick(face)}
                >
                  <img
                    src={`data:image/jpeg;base64,${face.image}`}
                    className="face-image"
                  />
                  {selectedFace && selectedFace._id === face._id && !viewPhotosMode && (
                    <div className="face-actions">
                      <button onClick={handleViewPhotos}>View Photos</button>
                      <button onClick={handleTagFace}>Tag Face</button>
                      
                      {showDropdown && (
                        <div className="tagging-section" onClick={handleDropdownClick}>
                          {showNewLabelInput ? (
                            <>
                              <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Enter new label"
                              />
                              <button onClick={handleTagFaceSubmit}>Save Label</button>
                            </>
                          ) : (
                            <select value={selectedLabel} onChange={handleLabelChange}>
                              <option value="">Select a Label</option>
                              {labels.map((label, index) => (
                                <option key={index} value={label}>{label}</option>
                              ))}
                              <option value="new">New Label</option>
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FacesPage;

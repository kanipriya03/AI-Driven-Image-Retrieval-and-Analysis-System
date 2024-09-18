
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMessage('Please upload a file or image.');
            return;
        }

        setIsUploading(true);
        setErrorMessage('');
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.text();
                console.log('Upload response:', result);
                setFile(null);
                alert('Upload successful!');

                // Debugging: Check if navigation is working
                console.log('Redirecting to /search...');
                
                // Redirect to SearchPage
                navigate('/search');
            } else {
                const errorResult = await response.text();
                console.error('Server response:', errorResult);
                setErrorMessage(`Upload failed: ${errorResult}`);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setErrorMessage('Upload failed, please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-page">
            <h1 className="upload-title">Upload Images</h1>
            <div className={`upload-container ${isUploading ? 'spinning' : ''}`}>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file-input" 
                />
            </div>
            <button 
                onClick={handleUpload} 
                className="upload-button"
                disabled={isUploading}
            >
                Upload
            </button>

            {isUploading && <div className="processing-message">
                Processing...
            </div>}

            {errorMessage && <div className="error-message">
                {errorMessage}
            </div>}
        </div>
    );
};

export default UploadPage;
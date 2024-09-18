

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ImagesPage.css';

// const ImagesPage = () => {
//     const [images, setImages] = useState([]);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/images');
//                 setImages(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Error fetching images.');
//                 console.error('Error fetching images:', err);
//                 setLoading(false);
//             }
//         };

//         fetchImages();
//     }, []);

//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             alert('Please select a file first.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             const response = await axios.post('http://localhost:5000/upload', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             setSuccessMessage(response.data.message);
//             setFile(null);

//             // Refresh the image list after upload
//             const imageResponse = await axios.get('http://localhost:5000/images');
//             setImages(imageResponse.data);
//         } catch (err) {
//             setError('Error uploading image.');
//             console.error('Error uploading image:', err);
//         }
//     };

//     const handleDelete = async (imageId, hash, isFaceImage = false) => {
//         console.log(`Attempting to delete image with ID: ${imageId}, Hash: ${hash}, isFaceImage: ${isFaceImage}`);

//         try {
//             // Create the request body
//             const requestBody = {
//                 image_id: imageId,
//                 is_face_image: isFaceImage
//             };

//             // Send the DELETE request
//             const response = await axios.delete(`http://localhost:5000/delete-image/${hash}`, {
//                 data: requestBody
//             });

//             console.log('Delete response:', response.data);

//             // Remove the deleted image from the state
//             setImages(images.filter(img => img._id !== imageId));
//             setSuccessMessage('Image and related data deleted successfully.');
//         } catch (err) {
//             console.error('Error deleting image and related data:', err.response ? err.response.data : err.message);
//             setError('Error deleting image and related data.');
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div>
//             <div className="button-container">
//                 <input
//                     type="file"
//                     accept="image/jpeg,image/png,image/gif"
//                     onChange={handleFileChange}
//                     style={{ display: 'none' }}
//                     id="file-upload"
//                 />
//                 <button onClick={() => document.getElementById('file-upload').click()}>Add Image</button>
//                 <button onClick={handleUpload} disabled={!file}>Upload Image</button>
//             </div>
//             <h1>Uploaded Images</h1>
//             {successMessage && <p>{successMessage}</p>}
//             {images.length === 0 ? (
//                 <p>No images available.</p>
//             ) : (
//                 <div className="image-grid">
//                     {images.map((image) => (
//                         <div key={image._id} className="image-item">
//                             <img
//                                 src={`data:image/jpeg;base64,${image.image}`} // Corrected: use the base64 data from the image field
//                                 alt={image.filename}
//                                 onError={(e) => console.log('Image failed to load:', e)} // Debug: Log any load errors
//                             />
//                             <button
//                                 className="delete-button"
//                                 onClick={() => handleDelete(image._id, image.hash, image.isFaceImage)}
//                             >
//                                 Delete
//                             </button>
//                             <p>{image.filename}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImagesPage;


// images.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ImagesPage.css';

const ImagesPage = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/images');
                console.log(response.data); // Log image data
                setImages(response.data);
            } catch (err) {
                setError(`Error fetching images: ${err.response ? err.response.data : err.message}`);
                console.error('Error fetching images:', err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchImages();
    }, []);
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccessMessage(response.data.message);
            setFile(null);

            // Refresh the image list after upload
            const imageResponse = await axios.get('http://localhost:5000/images');
            setImages(imageResponse.data);
        } catch (err) {
            setError('Error uploading image.');
            console.error('Error uploading image:', err);
        }
    };



    const handleDelete = async (imageHash) => {
        try {
            await axios.delete(`http://localhost:5000/deleteByHash/${imageHash}`);
    
            // Remove the deleted image from the state
            setImages(images.filter(img => img.hash !== imageHash));
            setSuccessMessage('Image and related data deleted successfully.');
        } catch (err) {
            console.error('Error deleting image and related data:', err.response ? err.response.data : err.message);
            setError(`Error deleting image and related data: ${err.response ? err.response.data : err.message}`);
        }
    };
    
    


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="button-container">
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <button onClick={() => document.getElementById('file-upload').click()}>Add Image</button>
                <button onClick={handleUpload} disabled={!file}>Upload Image</button>
            </div>
            <h1>Uploaded Images</h1>
            {successMessage && <p>{successMessage}</p>}
            {images.length === 0 ? (
                <p>No images available.</p>
            ) : (
                <div className="image-grid">
                    {images.map((image) => (
                        <div key={image._id} className="image-item">
                            <img
                                src={`data:image/jpeg;base64,${image.image}`} // Corrected: use the base64 data from the image field
                                alt={image.filename}
                                onError={(e) => console.log('Image failed to load:', e)} // Debug: Log any load errors
                            />
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(image.hash)}
                            >
                                Delete
                            </button>
                            <p>{image.filename}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImagesPage;
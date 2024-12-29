import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Pictures = () => {
    const [mode, setMode] = useState('upload'); // 'upload' or 'backend'
    const [uploadedImageName, setUploadedImageName] = useState(null); // Name of the last uploaded image
    const [imageList, setImageList] = useState([]); // List of images fetched from the backend
    const [selectedImage, setSelectedImage] = useState(null); // Currently selected image from the backend
    const [isImageSelected, setIsImageSelected] = useState(false); // To track if an image is selected
    const navigate = useNavigate();  // Use React Router's useNavigate hook

    // Handle file input change (upload image)
// Handle file input change (upload image)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            const accessToken = sessionStorage.getItem('access_token'); // Get access token from sessionStorage

            // Upload image to the server with Authorization header
            fetch('https://labb2pictures.app.cloud.cbh.kth.se/images', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.filePath) {
                        // Update the state with the uploaded image name
                        setUploadedImageName(data.filePath);
                        alert(`Image "${data.filePath}" uploaded successfully!`);
                    } else {
                        alert('Error uploading image');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert('Error uploading image');
                });
        }
    };


    // Fetch image list from the backend
// Fetch image list from the backend
    const fetchImages = async () => {
        try {
            const accessToken = sessionStorage.getItem('access_token');

            // Fetch images with Authorization header
            const response = await fetch('https://labb2pictures.app.cloud.cbh.kth.se/images', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();

            if (data.files) {
                setImageList(data.files); // Set the fetched image list
            } else {
                alert('No files found in the response');
            }
        } catch (error) {
            console.error(error);
            alert('Error fetching images.');
        }
    };


    // Handle image selection from backend
    const selectImage = (image) => {
        setSelectedImage(image);
        setIsImageSelected(true);
    };

    // Navigate to the edit page with a backend image
    const fetchAndNavigateToEditPage = () => {
        if (selectedImage) {
            // Use navigate() to go to the edit page, keeping the session intact
            navigate(`/edit?imageName=${encodeURIComponent(selectedImage)}`);
        } else {
            alert('Please select an image first.');
        }
    };

    // Toggle between modes
    const toggleMode = (newMode) => {
        setMode(newMode);
        setSelectedImage(null);
        setIsImageSelected(false);
        setImageList([]);
        setUploadedImageName(null); // Clear the uploaded image name when switching modes
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Picture Management</h1>

            {/* Mode Toggle */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => toggleMode('upload')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: mode === 'upload' ? '#007bff' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Upload Image
                </button>
                <button
                    onClick={() => toggleMode('backend')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: mode === 'backend' ? '#007bff' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Load from Backend
                </button>
            </div>

            {/* Upload Mode */}
            {mode === 'upload' && (
                <div>
                    <input type="file" onChange={handleFileChange} />
                    {uploadedImageName && (
                        <p style={{ color: 'green', marginTop: '10px' }}>
                            Last uploaded image: {uploadedImageName}
                        </p>
                    )}
                </div>
            )}

            {/* Backend Mode */}
            {mode === 'backend' && (
                <div>
                    <button onClick={fetchImages} style={{ marginBottom: '10px' }}>
                        Load Images
                    </button>
                    <div
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            minHeight: '200px',
                            overflow: 'auto',
                        }}
                    >
                        {imageList.length === 0 ? (
                            <p>No images loaded. Click "Load Images" to fetch them.</p>
                        ) : (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {imageList.map((image, index) => (
                                    <li
                                        key={index}
                                        onClick={() => selectImage(image)}
                                        style={{
                                            cursor: 'pointer',
                                            background:
                                                selectedImage === image ? '#f0f0f0' : 'transparent',
                                            padding: '5px 10px',
                                            borderRadius: '3px',
                                        }}
                                    >
                                        {image}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Backend Edit Button */}
            {mode === 'backend' && (
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={fetchAndNavigateToEditPage}
                        disabled={!isImageSelected}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isImageSelected ? '#007bff' : '#ccc',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isImageSelected ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Select and Edit Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pictures;

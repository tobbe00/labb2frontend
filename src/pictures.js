import React, { useState } from 'react';

const Pictures = () => {
    const [mode, setMode] = useState('upload'); // 'upload' or 'backend'
    const [uploadedImage, setUploadedImage] = useState(null); // Selected image file from the computer
    const [imageList, setImageList] = useState([]); // List of images fetched from the backend
    const [selectedImage, setSelectedImage] = useState(null); // Currently selected image
    const [isImageSelected, setIsImageSelected] = useState(false); // To track if an image is selected

    // Handle file input change
    const handleFileChange = (e) => {
        setUploadedImage(e.target.files[0]);
    };

    // Upload image to the backend
    const uploadImage = async () => {
        if (!uploadedImage) {
            alert('Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', uploadedImage);

        try {
            const response = await fetch('http://localhost:3000/images', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            alert('Image uploaded successfully!');
            setUploadedImage(null); // Reset uploaded image
        } catch (error) {
            console.error(error);
            alert('Error uploading image.');
        }
    };

    // Fetch image list from the backend (port 3001)
    const fetchImages = async () => {
        try {
            const response = await fetch('http://localhost:3001/images');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const data = await response.json();
            // Correctly reference the 'files' array in the response
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

    // Handle image selection
    const selectImage = (image) => {
        setSelectedImage(image);
        setIsImageSelected(true); // Set to true when an image is selected
    };

    // Navigate to the edit page
    const goToEditPage = () => {
        if (selectedImage) {
            window.location.href = `/edit?image=${encodeURIComponent(selectedImage)}`;
        } else {
            alert('Please select an image first.');
        }
    };

    // Slider toggle handler
    const toggleMode = (newMode) => {
        setMode(newMode);
        setSelectedImage(null); // Reset the selected image when switching modes
        setIsImageSelected(false); // Reset button state
        setImageList([]); // Reset image list when switching to 'upload' mode
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

            {/* Content Based on Mode */}
            {mode === 'upload' && (
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={uploadImage} style={{ marginLeft: '10px' }}>
                        Upload
                    </button>
                </div>
            )}

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

            {/* Select Image Button - Disabled initially */}
            {mode === 'backend' && (
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={goToEditPage}
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

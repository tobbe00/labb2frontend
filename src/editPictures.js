import React, { useState, useEffect, useRef } from 'react';

const EditPictures = () => {
    const [imageData, setImageData] = useState(null); // Image data for the canvas
    const canvasRef = useRef(null); // Reference to the canvas element
    const [context, setContext] = useState(null); // Canvas 2D context
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [mode, setMode] = useState('draw'); // Current mode ('draw', 'text')
    const [drawColor, setDrawColor] = useState('#000000'); // Drawing color
    const [isDrawing, setIsDrawing] = useState(false); // Is drawing in progress
    const [text, setText] = useState(''); // Text input for text mode
    const [imageName, setImageName] = useState('edited-image'); // Name for the saved image
    const [boxSize] = useState({ width: 500, height: 500 }); // Box size

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const imageName = queryParams.get('imageName');
        const encodedImageData = queryParams.get('imageData');

        if (encodedImageData) {
            setImageData(decodeURIComponent(encodedImageData));
            setLoading(false);
        } else if (imageName) {
            const accessToken = sessionStorage.getItem('access_token'); // Get access token from sessionStorage

            fetch(`https://labb2pictures.app.cloud.cbh.kth.se/images/${imageName}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Include the token in the Authorization header
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch the image from the server.');
                    }
                    return response.blob();
                })
                .then((blob) => {
                    const imageURL = URL.createObjectURL(blob);
                    setImageData(imageURL);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Error loading image from the server.');
                    setLoading(false);
                });

        } else {
            setError('No image data or name provided in the query.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (imageData && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            setContext(ctx);

            const image = new Image();
            image.src = imageData;
            image.onload = () => {
                const scale = Math.min(
                    boxSize.width / image.width,
                    boxSize.height / image.height
                );
                const scaledWidth = image.width * scale;
                const scaledHeight = image.height * scale;

                canvas.width = boxSize.width;
                canvas.height = boxSize.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const xOffset = (boxSize.width - scaledWidth) / 2;
                const yOffset = (boxSize.height - scaledHeight) / 2;

                ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight);
            };
        }
    }, [imageData, boxSize]);

    const handleMouseDown = (e) => {
        if (!context) return;

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        if (mode === 'draw') {
            setIsDrawing(true);
            context.beginPath();
            context.moveTo(x, y);
        } else if (mode === 'text' && text.trim()) {
            context.font = '20px Arial';
            context.fillStyle = drawColor;
            context.textAlign = 'left';
            context.fillText(text, x, y);
            setText(''); // Clear the input after placing text
        }
    };

    const handleMouseMove = (e) => {
        if (mode === 'draw' && isDrawing) {
            const x = e.nativeEvent.offsetX;
            const y = e.nativeEvent.offsetY;
            context.lineTo(x, y);
            context.strokeStyle = drawColor;
            context.lineWidth = 2;
            context.stroke();
        }
    };

    const handleMouseUp = () => {
        if (mode === 'draw') {
            setIsDrawing(false);
            context.closePath();
        }
    };

    const saveImageToServer = () => {
        const canvas = canvasRef.current;

        canvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('image', blob, `${imageName || 'edited-image'}.png`);

            const accessToken = sessionStorage.getItem('access_token'); // Get access token from sessionStorage

            // Upload image to the server with Authorization header
            fetch('https://labb2pictures.app.cloud.cbh.kth.se/images', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to save the image on the server.');
                    }
                    return response.json();
                })
                .then((data) => {
                    alert('Image saved successfully on the server!');
                    console.log('Server response:', data);
                })
                .catch((error) => {
                    console.error('Error saving image to server:', error);
                    alert('Failed to save image on the server.');
                });
        }, 'image/png');
    };


    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Edit Picture</h1>
            {loading ? (
                <p>Loading image...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div>
                    <canvas
                        ref={canvasRef}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: `${boxSize.width}px`,
                            height: `${boxSize.height}px`,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    ></canvas>
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={() => setMode('draw')}>Draw Mode</button>
                        <button onClick={() => setMode('text')}>Text Mode</button>
                        <input
                            type="color"
                            value={drawColor}
                            onChange={(e) => setDrawColor(e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        {mode === 'text' && (
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text"
                                style={{ marginRight: '10px' }}
                            />
                        )}
                        <input
                            type="text"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            placeholder="Image name"
                            style={{ marginRight: '10px' }}
                        />
                        <button onClick={saveImageToServer}>Save Image</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditPictures;

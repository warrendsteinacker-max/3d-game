import React, { useState } from 'react';

const StarryTask = () => {
  const [images, setImages] = useState([]);

  const handleClick = (e) => {
    // 1. Capture coordinates
    const newImage = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };

    // 2. Add to state
    setImages((prev) => [...prev, newImage]);

    // 3. Perfect spot for your "Automated Logging"
    console.log(`Image inserted at X: ${e.clientX}, Y: ${e.clientY} for training.`);
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100vh',
        // Use your space image from the public folder
        backgroundImage: "url('/vimal-s-GBg3jyGS-Ug-unsplash.jpg')",
        backgroundSize: 'cover',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'crosshair'
      }}
    >
      <h2 style={{ color: 'white', textAlign: 'center', pointerEvents: 'none' }}>
        Click anywhere to drop an object
      </h2>

      {images.map((img) => (
        <img
          key={img.id}
          src="/your-inserted-image.png" // Path to the small image you want to drop
          style={{
            position: 'absolute',
            left: img.x - 25, // Subtract half width to center on cursor
            top: img.y - 25,  // Subtract half height to center on cursor
            width: '50px',
            pointerEvents: 'none' // Allows you to click "through" the image to add more
          }}
          alt="placed-object"
        />
      ))}
    </div>
  );
};

export default StarryTask;
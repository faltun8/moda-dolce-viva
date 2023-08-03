import React, { useEffect } from 'react';

const ImageModal = ({ imageUrl, onClose }) => {
    // Handle clicks outside the image area
    const handleClickOutside = (event) => {
        if (event.target.classList.contains('modal')) {
            onClose();
        }
    };

    useEffect(() => {
        // Add event listener when the component mounts
        document.addEventListener('click', handleClickOutside);
        return () => {
            // Remove event listener when the component unmounts
            document.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <img src={imageUrl} alt="Image" className="modal-image" />
            </div>
        </div>
    );
};

export default ImageModal;
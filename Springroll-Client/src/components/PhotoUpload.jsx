import React, { useEffect, useState } from "react";

const PhotoUpload = ({ onFileSelect, preview = null }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(preview);
    const [validPreview, setValidPreview] = useState(true);

    // Whenever preview prop changes, reset
    useEffect(() => {
        setPreviewUrl(preview);
        setValidPreview(true);
    }, [preview]);

    // If preview fails to load, fallback
    const handleImageError = () => setValidPreview(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        onFileSelect(file);
        setValidPreview(true);
    };

    // Decide what to show
    const displayUrl = validPreview && previewUrl ? previewUrl : selectedFile ? URL.createObjectURL(selectedFile) : null;

    return (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-900">
            {displayUrl ? (
                <img
                    src={displayUrl}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={handleImageError}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Click to select an image
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    );
};

export default PhotoUpload;
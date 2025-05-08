import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Supported file types for bulk bookmark import
const SUPPORTED_FILE_TYPES = ['.csv', '.txt', '.md', '.html'];
const MAX_FILE_SIZE_MB = 10;
const MAX_BOOKMARKS = 500;

const FileUploadComponent = ({ onFileUpload, onError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  // Validate file before processing
  const validateFile = (file) => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const fileSizeMB = file.size / 1024 / 1024;

    // Check file type
    if (!SUPPORTED_FILE_TYPES.includes(fileExtension)) {
      onError(`Unsupported file type. Supported types are: ${SUPPORTED_FILE_TYPES.join(', ')}`);
      return false;
    }

    // Check file size
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      onError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return false;
    }

    return true;
  };

  // Handle file input change
  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(validateFile);

    if (validFiles.length > 1) {
      onError(`Maximum ${MAX_BOOKMARKS} bookmarks allowed per upload`);
      return;
    }

    setFiles(validFiles);
    if (validFiles.length > 0) {
      onFileUpload(validFiles[0]);
    }
  };

  // Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Trigger file input on button click
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div 
      className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors 
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={false}
        accept={SUPPORTED_FILE_TYPES.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-600 font-semibold">
          Drag and drop your bookmark file here
        </p>
        <span className="text-sm text-gray-500">
          or
        </span>
        <button 
          type="button" 
          onClick={onButtonClick} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Select File
        </button>
        <p className="text-xs text-gray-500">
          Supported formats: {SUPPORTED_FILE_TYPES.join(', ')} (Max {MAX_FILE_SIZE_MB}MB)
        </p>
      </div>
    </div>
  );
};

FileUploadComponent.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  onError: PropTypes.func
};

FileUploadComponent.defaultProps = {
  onError: () => {}
};

export default FileUploadComponent;
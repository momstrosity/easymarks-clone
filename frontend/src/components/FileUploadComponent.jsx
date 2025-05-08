import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * FileUploadComponent handles file uploads with drag-and-drop and file input support
 * @param {Object} props - Component props
 * @param {Function} props.onFileUpload - Callback function when files are uploaded
 * @param {string[]} props.acceptedFileTypes - Allowed file types for upload
 * @param {number} props.maxFileSize - Maximum file size in bytes
 * @param {number} props.maxFiles - Maximum number of files that can be uploaded
 */
const FileUploadComponent = ({
  onFileUpload, 
  acceptedFileTypes = ['.csv', '.txt', '.md', '.html'], 
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  /**
   * Validate uploaded files
   * @param {FileList} fileList - Files to validate
   * @returns {File[]} Validated files
   */
  const validateFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(file => {
      // Check file type
      const isValidType = acceptedFileTypes.some(type => 
        file.name.toLowerCase().endsWith(type.replace('.', ''))
      );
      
      // Check file size
      const isValidSize = file.size <= maxFileSize;

      return isValidType && isValidSize;
    });

    // Limit number of files
    return validFiles.slice(0, maxFiles);
  };

  /**
   * Handle file drop event
   * @param {React.DragEvent} e - Drag event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const validFiles = validateFiles(e.dataTransfer.files);
      setFiles(validFiles);
      onFileUpload(validFiles);
    }
  };

  /**
   * Handle drag enter event
   * @param {React.DragEvent} e - Drag event
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /**
   * Handle drag leave event
   * @param {React.DragEvent} e - Drag event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  /**
   * Handle file input change
   * @param {React.ChangeEvent} e - Change event
   */
  const handleFileInput = (e) => {
    if (e.target.files) {
      const validFiles = validateFiles(e.target.files);
      setFiles(validFiles);
      onFileUpload(validFiles);
    }
  };

  /**
   * Trigger file input click
   */
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`
        p-6 border-2 border-dashed rounded-lg text-center 
        transition-colors duration-300
        ${dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 bg-white hover:border-blue-500'
        }
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={inputRef}
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        data-testid="file-input"
      />
      <div>
        <p className="text-gray-600 mb-4">
          Drag & drop your bookmark files here, or 
          <button 
            onClick={onButtonClick}
            className="ml-2 text-blue-600 hover:underline"
            data-testid="file-select-button"
          >
            Select Files
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Supported files: {acceptedFileTypes.join(', ')} 
          {` (Max ${maxFileSize / 1024 / 1024}MB, ${maxFiles} files)`}
        </p>
        {files.length > 0 && (
          <div className="mt-4" data-testid="uploaded-files">
            <h4 className="font-semibold">Uploaded Files:</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {file.name} ({Math.round(file.size / 1024)}KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

FileUploadComponent.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  maxFileSize: PropTypes.number,
  maxFiles: PropTypes.number
};

export default FileUploadComponent;
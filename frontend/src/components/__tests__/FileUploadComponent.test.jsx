import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadComponent from '../FileUploadComponent';

// Mock file creation utility
const createMockFile = (name, type, size) => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUploadComponent', () => {
  const mockOnFileUpload = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockOnFileUpload.mockClear();
    mockOnError.mockClear();
  });

  test('renders upload component with correct text', () => {
    render(<FileUploadComponent onFileUpload={mockOnFileUpload} />);
    
    expect(screen.getByText(/Drag and drop your bookmark file here/i)).toBeInTheDocument();
    expect(screen.getByText(/Select File/i)).toBeInTheDocument();
  });

  test('handles valid CSV file upload', () => {
    render(<FileUploadComponent onFileUpload={mockOnFileUpload} />);
    
    const file = createMockFile('bookmarks.csv', 'text/csv', 1024 * 1024); // 1MB
    const input = screen.getByTestId('file-input') || document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
  });

  test('rejects file larger than 10MB', () => {
    render(<FileUploadComponent onFileUpload={mockOnFileUpload} onError={mockOnError} />);
    
    const file = createMockFile('large_bookmarks.csv', 'text/csv', 11 * 1024 * 1024); // 11MB
    const input = screen.getByTestId('file-input') || document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnFileUpload).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('File size exceeds'));
  });

  test('rejects unsupported file type', () => {
    render(<FileUploadComponent onFileUpload={mockOnFileUpload} onError={mockOnError} />);
    
    const file = createMockFile('bookmarks.json', 'application/json', 1024 * 1024);
    const input = screen.getByTestId('file-input') || document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnFileUpload).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('Unsupported file type'));
  });
});
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadComponent from '../FileUploadComponent';

// Mock file for testing
const createMockFile = (name, size, type) => 
  new File(['test content'], name, { type, lastModified: Date.now() });

describe('FileUploadComponent', () => {
  const mockOnFileUpload = jest.fn();

  beforeEach(() => {
    mockOnFileUpload.mockClear();
  });

  test('renders file upload input', () => {
    render(<FileUploadComponent onFileUpload={mockOnFileUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    const selectButton = screen.getByTestId('file-select-button');
    
    expect(fileInput).toBeInTheDocument();
    expect(selectButton).toBeInTheDocument();
  });

  test('calls onFileUpload with valid files', () => {
    render(<FileUploadComponent onFileUpload={mockOnFileUpload} />);
    
    const file = createMockFile('test.csv', 1024, 'text/csv');
    const fileInput = screen.getByTestId('file-input');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(mockOnFileUpload).toHaveBeenCalledWith([file]);
  });

  test('limits file upload by file type', () => {
    render(<FileUploadComponent 
      onFileUpload={mockOnFileUpload} 
      acceptedFileTypes={['.csv']} 
    />);
    
    const validFile = createMockFile('test.csv', 1024, 'text/csv');
    const invalidFile = createMockFile('test.txt', 1024, 'text/plain');
    const fileInput = screen.getByTestId('file-input');
    
    fireEvent.change(fileInput, { target: { files: [validFile, invalidFile] } });
    
    expect(mockOnFileUpload).toHaveBeenCalledWith([validFile]);
  });

  test('limits file upload by file size', () => {
    render(<FileUploadComponent 
      onFileUpload={mockOnFileUpload} 
      maxFileSize={1024} // 1KB
    />);
    
    const smallFile = createMockFile('small.csv', 500, 'text/csv');
    const largeFile = createMockFile('large.csv', 2000, 'text/csv');
    const fileInput = screen.getByTestId('file-input');
    
    fireEvent.change(fileInput, { target: { files: [smallFile, largeFile] } });
    
    expect(mockOnFileUpload).toHaveBeenCalledWith([smallFile]);
  });

  test('limits number of files', () => {
    render(<FileUploadComponent 
      onFileUpload={mockOnFileUpload} 
      maxFiles={2}
    />);
    
    const file1 = createMockFile('test1.csv', 1024, 'text/csv');
    const file2 = createMockFile('test2.csv', 1024, 'text/csv');
    const file3 = createMockFile('test3.csv', 1024, 'text/csv');
    const fileInput = screen.getByTestId('file-input');
    
    fireEvent.change(fileInput, { target: { files: [file1, file2, file3] } });
    
    expect(mockOnFileUpload).toHaveBeenCalledWith([file1, file2]);
  });
});
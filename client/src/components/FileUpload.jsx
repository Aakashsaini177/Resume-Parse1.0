import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onUpload, isLoading, compact = false }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isLoading
  });

  if (compact) {
    return (
      <div
        {...getRootProps()}
        className={`h-full min-h-[42px] px-4 border border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-xs text-gray-600 font-medium whitespace-nowrap">
          {isLoading ? 'Processing...' : isDragActive ? 'Drop here' : 'Upload PDF/DOCX'}
        </p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <p className="text-gray-500">Processing...</p>
      ) : isDragActive ? (
        <p className="text-blue-500">Drop the resume here...</p>
      ) : (
        <div>
          <p className="text-gray-600 font-medium">Drag & drop resume here</p>
          <p className="text-sm text-gray-400 mt-1">or click to select (PDF, DOCX)</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

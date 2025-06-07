import React, { useState } from 'react';

interface FileUploadProps {
  multiple?: boolean;
  onFileChange?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ multiple = false, onFileChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      if (onFileChange) {
        onFileChange(selectedFiles);
      }
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      setUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File(s) uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Upload error:', error.message);
        alert('Error uploading file(s): ' + error.message);
      } else {
        console.error('Unknown error:', error);
        alert('Error uploading file(s)');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple={multiple} />
      <button onClick={handleFileUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File(s)'}
      </button>
    </div>
  );
};

export default FileUpload;
import React, { useState } from 'react';

const PngToWebp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState(new FormData());

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    const newFormData = new FormData();
    newFormData.append('image', e.target.files[0]);
    setFormData(newFormData);
  };

  const handleUpload = async () => {
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Upload successful');
        const data = await response.json();

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = `http://localhost:3000/downloads/${encodeURIComponent(data.filename)}`;
        link.download = 'converted_file.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log('Error uploading image:', response.statusText);
      }
    } catch (error) {
      console.log('Error uploading image', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Convert and Download Image
      </button>
    </div>
  );
};

export default PngToWebp;

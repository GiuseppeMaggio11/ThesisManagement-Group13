import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Trash, FileEarmarkPdf, FileEarmarkPlus } from 'react-bootstrap-icons';

function FileDropModal({ showModal, closeModal, handleSave, setSelectedFiles, selectedFiles }) {
  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setSelectedFiles(Array.from(e.dataTransfer.files));
  };

  const handleLabelClick = (e) => {
    e.preventDefault();
    document.getElementById('fileInput').click();
  };

  const handleFileInputChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>Select PDF Files</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="drop-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleLabelClick}
        >
          <label htmlFor="fileInput">
            <FileEarmarkPlus size={60} style={{ marginBottom: '8px' }} />
            <div>Drag & Drop or Click to Select PDF Files</div>
          </label>
        </div>
        <input
          type="file"
          id="fileInput"
          accept=".pdf"
          onChange={handleFileInputChange}
          multiple
          style={{ display: 'none' }}
        />
        <div style={{ marginTop: 5 }}>
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <FileEarmarkPdf /> {file.name}
              <Button variant="outline-danger" className="trash-btn" onClick={() => handleRemoveFile(index)}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Form onSubmit={handleSave}>
          <Button variant="danger" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Footer>
    </Modal>
  );
}

export default FileDropModal;

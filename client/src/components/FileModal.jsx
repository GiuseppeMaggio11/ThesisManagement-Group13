import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import {
  Trash,
  FileEarmarkPdf,
  FileEarmarkPlus,
  TrashFill,
} from "react-bootstrap-icons";
import { HoverIconButton } from "./HoverIconButton";
function FileDropModal({
  showModal,
  closeModal,
  handleSave,
  setSelectedFiles,
  selectedFiles,
}) {
  const [wrongInput, setWrongInput] = useState(false);
  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkAndAdd = (files) => {
    let oldFiles = [...selectedFiles];
    //console.log(files);
    files.forEach((newFile) => {
      const existingFile = oldFiles.find(
        (oldFile) => oldFile.name === newFile.name
      );
      // If not, push the new file to the old array
      if (!existingFile) {
        oldFiles.push(newFile);
      }
    });

    setSelectedFiles(oldFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setWrongInput(false);
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Filter only pdf's files
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    const nonPdfFilesExist = droppedFiles.some(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFilesExist) setWrongInput(true);

    checkAndAdd(pdfFiles);
  };

  const handleLabelClick = (e) => {
    e.preventDefault();
    document.getElementById("fileInput").click();
  };

  const handleFileInputChange = (e) => {
    setWrongInput(false);
    const newFiles = Array.from(e.target.files);
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");

    const nonPdfFilesExist = newFiles.some(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFilesExist) setWrongInput(true);

    checkAndAdd(pdfFiles);
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>Are you sure to apply to this thesis?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Upload all the files that the professor could need</div>
        <br></br>
        <div
          className={wrongInput ? "drop-area-wrong" : "drop-area"}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleLabelClick}
        >
          <label htmlFor="fileInput">
            <FileEarmarkPlus size={60} style={{ marginBottom: "8px" }} />
            {!wrongInput && <div>Drag & Drop or Click to Select PDF Files</div>}
            {wrongInput && (
              <div>
                {" "}
                <span className="text-wrong">Only </span>
                <span className="text-wrong-underlined">PDF</span>
                <span className="text-wrong"> files are allowed</span>{" "}
              </div>
            )}
          </label>
        </div>
        <input
          type="file"
          id="fileInput"
          accept=".pdf"
          onChange={handleFileInputChange}
          multiple
          style={{ display: "none" }}
        />
        <div style={{ marginTop: 5 }}>
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <FileEarmarkPdf style={{ marginRight: "0.5em" }} /> {file.name}
              <HoverIconButton
                defaultIcon={Trash}
                hoverIcon={TrashFill}
                className={"button-style-trash"}
                onClick={() => handleRemoveFile(index)}
              ></HoverIconButton>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Form>
          <Button
            className="button-style-cancel"
            variant="light"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="button-style"
            onClick={() => {
              handleSave();
              closeModal();
            }}
          >
            Save
          </Button>
        </Form>
      </Modal.Footer>
    </Modal>
  );
}

export default FileDropModal;

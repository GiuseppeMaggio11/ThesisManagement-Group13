import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Toasts = ({ message, type, onClose }) => {
    return (
      <ToastContainer
        className="below-nav"
        position="top-center"
        style={{
          marginTop: '1em',
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '9999', // Ensure it's above other elements if necessary
        }}
      >
        <Toast
          show={message !== ""}
          onClose={onClose}
          delay={10000}
          autohide={true}
          bg="danger"
          style={{ borderRadius: '50px', textAlign: 'center', backgroundColor: type==='success'?'green':'red' }}
        >
          <Toast.Body style={{ alignItems: 'center' }}>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };
  
export default Toasts;

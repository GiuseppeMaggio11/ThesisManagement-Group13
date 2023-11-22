import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toasts = ({ message, type, onClose }) => {
  useEffect(() => {
    if (type === 'success') {
      toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000, // Adjust as needed
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: onClose
      });
    } else if (type === 'error'){
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000, // Adjust as needed
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: onClose
      });
    }
  }, [message, type]);

  return null;
};

export default Toasts;

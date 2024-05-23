import React from 'react';


const Modal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <p>{message}</p>
            <div className="modal-actions">
              <button onClick={onConfirm}>Yes</button>
              <button onClick={onClose}>No</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Modal;

import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300); // Set delay to allow animation
    }
  }, [isOpen]);

  if (!isOpen && !showModal) return null;

  return (
    <div
      className={`fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className={`bg-white mb-4 mt-5 w-full max-w-md mx-auto p-4 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
        `}
      >
        <button onClick={onClose} className="absolute top-2 font-bold text-3xl right-2 text-gray-500 hover:text-gray-800">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

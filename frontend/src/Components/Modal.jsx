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
      className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className={`bg-white dark:bg-slate-900 mb-4 mt-5 w-full max-w-md mx-auto p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out transform relative
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
        `}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

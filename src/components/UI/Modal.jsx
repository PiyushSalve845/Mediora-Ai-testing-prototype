'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl">
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
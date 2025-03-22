import React from 'react'

const PopUpModular = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  return (
    <>
    <div className="blur-overlay" onClick={onClose}></div> {/* Click outside to close */}
    <div className="popup-window">
      {children} {/* Renders anything passed inside */}
    </div>
  </>
  )
}
export default PopUpModular

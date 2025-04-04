import React, { useEffect, useState } from 'react';

const AlertMessage = ({ message, type, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => setVisible(false), duration - 500); // Start fade-out before unmounting
    const removeTimer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose, duration]);

  return (
    <div className={`alert-message ${type} ${visible ? '' : 'hidden'}`}>
      <span>{message}</span>
      {onClose && <button className="close-btn" onClick={onClose}>╳</button>}
    </div>
  );
};

export default AlertMessage;

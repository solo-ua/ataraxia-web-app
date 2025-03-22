import React from 'react';

// Component to display an error message for input validation
export const InputError = ({ message }) => {
  return <p className='input_error'>{message}</p>;
};

// Component for alerts with action buttons
export const AlertMessage = ({ message, onConfirm, onCancel }) => {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

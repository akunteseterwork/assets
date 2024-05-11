import React, { useState } from 'react';
import axios from 'axios';

interface DeleteNotificationProps {
  onDeleteSuccess: () => void;
}

const DeleteNotification: React.FC<DeleteNotificationProps> = ({ onDeleteSuccess }) => {
  const [notificationId, setNotificationId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDeleteNotification = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this notification?');
        if (!confirmDelete) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}`,
        { withCredentials: true }
      );
      onDeleteSuccess();
      setErrorMessage('');
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className='max-w-screen-sm'>
      <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
        <div>
          <h1 className='text-sm'>Delete Notification</h1>
          <p className='text-[12px]'>Please fill in the details carefully</p>
        </div>
      </div>
      <hr className='-mx-4' />

      <div className="mb-4 mt-4">
        <label className="block text-xs font-medium text-gray-800">Notification ID</label>
        <input
          type="text"
          required
          className="w-full border rounded-md px-3 py-2 text-xs mt-1"
          placeholder="Enter Notification ID"
          value={notificationId}
          onChange={(e) => setNotificationId(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 text-xs"
        onClick={handleDeleteNotification}
      >
        Delete Notification
      </button>
      {errorMessage && (
        <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default DeleteNotification;

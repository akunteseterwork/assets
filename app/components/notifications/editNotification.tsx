import React, { useState } from 'react';
import axios from 'axios';

interface EditNotificationProps {
    onEditSuccess: () => void;
}

const EditNotification: React.FC<EditNotificationProps> = ({ onEditSuccess }) => {
    const [notificationId, setNotificationId] = useState('');
    const [notificationData, setNotificationData] = useState({
        userId: '',
        type: '',
        content: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleEditNotification = async () => {
        const confirmEdit = window.confirm('Are you sure you want to edit this notification?');
        if (!confirmEdit) return;
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}`,
                {
                    userId: notificationData.userId,
                    type: notificationData.type,
                    content: notificationData.content
                },
                { withCredentials: true }
            );
            onEditSuccess();
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error editing notification:', error);
            setErrorMessage(error.response.data.message);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNotificationData({ ...notificationData, type: e.target.value });
    };

    return (
        <div className='max-w-screen-sm'>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>Edit Notification</h1>
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
            <div className="mb-4 mt-4">
                <label className="block text-xs font-medium text-gray-800">User ID</label>
                <input
                    type="text"
                    required
                    className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                    placeholder="Enter User ID"
                    value={notificationData.userId}
                    onChange={(e) => setNotificationData({ ...notificationData, userId: e.target.value })}

                />
            </div>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-800">Type</label>
                <select
                    className="border rounded-md px-3 py-2 text-xs mt-1"
                    value={notificationData.type}
                    onChange={handleTypeChange}
                >
                    <option value="">Select Type</option>
                    <option value="admin">Admin</option>
                    <option value="system">System</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-800">Message</label>
                <input
                    type="text"
                    required
                    className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                    placeholder="Enter Content"
                    value={notificationData.content}
                    onChange={(e) => setNotificationData({ ...notificationData, content: e.target.value })}
                />
            </div>
            <button
                type="button"
                className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-xs"
                onClick={handleEditNotification}
            >
                Edit Notification
            </button>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
        </div>
    );
};

export default EditNotification;

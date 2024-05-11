import React, { useState } from 'react';
import axios from 'axios';

interface SendGlobalNotificationProps {
    onSendSuccess: () => void;
}

const SendGlobalNotification: React.FC<SendGlobalNotificationProps> = ({ onSendSuccess }) => {
    const [notificationData, setNotificationData] = useState({
        type: '',
        content: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSendNotification = async () => {
        const confirmSend = window.confirm('Are you sure you want to send this global notification?');
        if (!confirmSend) return;

        try {
            await axios.post(
                process.env.NEXT_PUBLIC_API_URL + '/api/notifications/global',
                {
                    type: notificationData.type,
                    content: notificationData.content
                },
                {
                    headers: {
                        'X-Notification-Sender': 'system',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                    }
                }
            );
            onSendSuccess();
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error sending global notification:', error);
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
                    <h1 className='text-sm'>Send Global Notification</h1>
                    <p className='text-[12px]'>Please fill in the details carefully</p>
                </div>
            </div>
            <hr className='-mx-4' />

            <div className="mb-4 mt-4">
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
                onClick={handleSendNotification}
            >
                Send Global Notification
            </button>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
        </div>
    );
};

export default SendGlobalNotification;

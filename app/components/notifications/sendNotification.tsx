import React, { useState } from 'react';
import axios from 'axios';

interface SendNotificationProps {
    onSendSuccess: () => void;
}

const SendNotification: React.FC<SendNotificationProps> = ({ onSendSuccess }) => {
    const [notificationData, setNotificationData] = useState({
        userId: '',
        type: '',
        content: ''
    });
    const [searchType, setSearchType] = useState<'username' | 'email'>('username');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users?${searchType}=${searchQuery}`,
                { withCredentials: true }
            );
            setSearchResult(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error searching user:', error);
            setSearchResult(null);
            setErrorMessage('Error searching user');
        }
    };

    const handleSendNotification = async () => {
        const confirmActivate = window.confirm('Are you sure you want to send this notification?');
        if (!confirmActivate || !searchResult || !searchResult.data || searchResult.data.length === 0) return;

        const userId = searchResult.data[0].id;
        console.log(process.env.X_NOTIFICATION_SENDER)
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
                { userId: userId, type: notificationData.type, content: notificationData.content },
                {
                    headers: {
                        'X-Notification-Sender': 'admin',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                    }
                }
            );
            onSendSuccess();
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error activating user:', error);
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
                    <h1 className='text-sm'>Send Notification</h1>
                    <p className='text-[12px]'>Please fill in the details carefully</p>
                </div>
            </div>
            <hr className='-mx-4' />
            <div className="flex items-center mt-4">
                <select
                    className="border rounded-md px-3 py-2 text-xs mt-1 mr-2"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'username' | 'email')}
                >
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                </select>
                <input
                    type="text"
                    className="border rounded-md px-3 py-2 text-xs mt-1 mr-2"
                    placeholder={`Enter ${searchType}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-xs"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            {searchResult && searchResult.data && searchResult.data.length > 0 ? (
                <div>
                    <p className='text-gray-800 text-xs mt-2 mb-2 font-semibold'>User Found!</p>
                    <table className="border mb-4 rounded-xl">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 text-xs">Username:</td>
                                <td className="border px-4 py-2 text-xs">Email:</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 text-xs">{searchResult.data[0].username}</td>
                                <td className="border px-4 py-2 text-xs">{searchResult.data[0].email}</td>
                            </tr>
                        </tbody>
                    </table>
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
                        onClick={handleSendNotification}
                    >
                        Send Notification
                    </button>
                    {errorMessage && (
                        <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                    )}
                </div>
            ) : (
                <p className="text-gray-800 text-xs mt-2 mb-2 font-semibold">No user found.</p>
            )}
        </div>
    );
};

export default SendNotification;

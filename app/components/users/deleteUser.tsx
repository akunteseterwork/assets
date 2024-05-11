import React, { useState } from 'react';
import axios from 'axios';

interface DeleteUserProps {
    onUserDelete: () => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ onUserDelete }) => {
    const [searchType, setSearchType] = useState<'username' | 'email'>('username');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users?${searchType}=${searchQuery}`, { withCredentials: true });
            setSearchResult(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error searching user:', error);
            setSearchResult(null);
            setErrorMessage('Error searching user');
        }
    };

    const handleDelete = async (userId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, { withCredentials: true });
            onUserDelete();
            setErrorMessage('');
        } catch (error: any) {
            console.error('Error deleting user:', error);
            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>Delete User</h1>
                    <p className='text-[12px]'>Double check the user before deleting user, there's no going back</p>
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

            {searchResult && searchResult.data ? (
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
                    <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 text-xs"
                        onClick={() => handleDelete(searchResult.data[0].id)}
                    >
                        Delete User
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

export default DeleteUser;

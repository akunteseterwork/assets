import React, { useState } from 'react';
import axios from 'axios';

interface DeleteVoucherProps {
    onVoucherDeleted: () => void;
}

const DeleteVoucher: React.FC<DeleteVoucherProps> = ({ onVoucherDeleted }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vouchers?code=${searchQuery}`, { withCredentials: true });
            setSearchResult(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error searching user:', error);
            setSearchResult(null);
            setErrorMessage('Error searching user');
        }
    };

    const handleDelete = async (code: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this voucher?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/vouchers/${code}`, { withCredentials: true });
            onVoucherDeleted();
            setErrorMessage('');
        } catch (error: any) {
            setErrorMessage(error.response.data.message);
        }
    };


    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>Delete Voucher</h1>
                    <p className='text-[12px]'>Be careful deleting voucher</p>
                </div>
            </div>
            <hr className='-mx-4' />
            <div className="flex items-center mt-4">
                <input
                    type="text"
                    className="border rounded-md px-3 py-2 text-xs mt-1 mr-2"
                    placeholder={`Enter voucher code`}
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
                    <p className='text-gray-800 text-xs mt-2 mb-2 font-semibold'>Voucher Found!</p>
                    <table className="border mb-4 rounded-xl">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 text-xs">Name:</td>
                                <td className="border px-4 py-2 text-xs">Limit:</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 text-xs">{searchResult.data[0].name}</td>
                                <td className="border px-4 py-2 text-xs">{searchResult.data[0].limit}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 text-xs"
                        onClick={() => handleDelete(searchResult.data[0].code)}
                    >
                        Delete Voucher
                    </button>
                    {errorMessage && (
                        <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                    )}
                </div>
            ) : (
                <p className="text-gray-800 text-xs mt-2 mb-2 font-semibold">No voucher found.</p>
            )}
        </div>
    );
};

export default DeleteVoucher;

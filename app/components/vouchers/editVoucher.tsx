import React, { useState } from 'react';
import axios from 'axios';

interface EditVoucherProps {
    onVoucherEdited: () => void;
}

const EditVoucher: React.FC<EditVoucherProps> = ({ onVoucherEdited }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [voucherData, setVoucherData] = useState({
        name: '',
        limit: ''
    });

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

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/vouchers/${searchResult.data[0].code}`, voucherData, { withCredentials: true });
            onVoucherEdited();
            setErrorMessage('');
        } catch (error: any) {
            setErrorMessage(error.response.data.message);
        }
    };


    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>Edit Voucher</h1>
                    <p className='text-[12px]'>Double check the voucher before edit</p>
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

                    <form className="mt-4 max-w-screen-sm w-full" onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-800">Voucher Name</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                                placeholder="Enter voucher name"
                                value={voucherData.name}
                                onChange={(e) => setVoucherData({ ...voucherData, name: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-800">Voucher Limit</label>
                            <input
                                type="number"
                                required
                                className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                                placeholder="Enter voucher limit"
                                value={voucherData.limit}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value > 0) {
                                        setVoucherData({ ...voucherData, limit: value.toString() });
                                    }
                                }}
                            />
                        </div>
                        {errorMessage && (
                            <p className="text-xs italic text-red-500 mb-4">{errorMessage}</p>
                        )}

                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-xs"
                        >
                            Update Voucher
                        </button>

                    </form>
                </div>
            ) : (
                <p className="text-gray-800 text-xs mt-2 mb-2 font-semibold">No voucher found.</p>
            )}
        </div>
    );
};

export default EditVoucher;

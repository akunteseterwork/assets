import React, { useState } from 'react';
import axios from 'axios';

interface CreateVoucherProps {
    onCreateSuccess: () => void;
}

const CreateVoucher: React.FC<CreateVoucherProps> = ({ onCreateSuccess }) => {
    const [voucherData, setVoucherData] = useState({
        name: '',
        limit: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL+'/api/vouchers', voucherData, { withCredentials: true });
            setVoucherData({
                name: '',
                limit: ''
            });
            onCreateSuccess();
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>Create Voucher</h1>
                    <p className='text-[12px]'>Please fill in the details carefully</p>
                </div>
            </div>
            <hr className='-mx-4' />
            <form className="mt-4 max-w-screen-sm w-full" onSubmit={handleFormSubmit}>
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
                    Create Voucher
                </button>

            </form>
        </div>
    );
};

export default CreateVoucher;

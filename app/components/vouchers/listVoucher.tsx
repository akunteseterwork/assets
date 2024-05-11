import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Triangle } from 'react-loader-spinner';

interface Voucher {
    id: number;
    code: string;
    name: string;
    user: string | null;
    limit: number;
    remaining: number;
}

const ListVouchers: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[] | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchParam, setSearchParam] = useState<string>('name');
    const [loading, setLoading] = useState<boolean>(false);
    const itemsPerPage = 10;
    useEffect(() => {
        if (searchTerm === '') {
            fetchVouchers();
        }
    }, [currentPage, searchTerm, searchParam]);

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL+'/api/vouchers', {
                params: {
                    page: currentPage,
                    per_page: itemsPerPage,
                    [searchParam]: searchTerm,
                },
                withCredentials: true,
            });
            setVouchers(response.data.data);
            setTotalPages(response.data.pagination.page_total);
            setTotalItems(response.data.pagination.total);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchVouchers();
    };

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParam(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch();
    };

    const startSerialNumber = totalItems - itemsPerPage * (currentPage - 1) ;


    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>List Vouchers</h1>
                    <p className='text-[12px]'>You can manage vouchers from the Sidebar menu</p>
                </div>
            </div>
            <hr className='-mx-4' />
            <form onSubmit={handleSubmit}>
                <div className="flex items-center mt-2 w-half">
                    <select value={searchParam} onChange={handleParamChange} className="border rounded-md px-3 py-2 text-xs mr-2">
                        <option value="name">Name</option>
                        <option value="code">Code</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search vouchers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-md px-3 py-2 text-xs w-half mr-2"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-xs"
                    >
                        Search
                    </button>
                </div>
            </form>
            <div className="border text-gray-500 w-full p-3 rounded-2xl overflow-x-auto mt-4">
                <table className="w-full table-auto">
                    <thead className="text-left text-[12px]">
                        <tr className="border-b-2">
                            <th className="p-2">No</th>
                            <th className="p-2">Code</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Used By</th>
                            <th className="p-2">Limit</th>
                            <th className="p-2">Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-2 text-xs justify-center">
                                    <Triangle color="#358BF6" height={20} width={20} />
                                </td>
                            </tr>
                        ) : vouchers && vouchers.length > 0 ? (
                            vouchers.map((voucher, index) => (
                                <tr key={voucher.id}>
                                    <td className="p-2 text-xs">{startSerialNumber - index}</td>
                                    <td className="p-2 text-xs">{voucher.code}</td>
                                    <td className="p-2 text-xs">{voucher.name}</td>
                                    <td className="p-2 text-xs">{voucher.user || 'Belum Digunakan'}</td>
                                    <td className="p-2 text-xs">{voucher.limit}</td>
                                    <td className="p-2 text-xs">{voucher.remaining}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-2 text-xs">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border hover:bg-blue-600 hover:text-white text-xs mr-2"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border hover:bg-blue-600 hover:text-white text-xs"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListVouchers;

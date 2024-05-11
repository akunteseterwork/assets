import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Triangle } from 'react-loader-spinner';

interface Notification {
    id: number;
    type: string;
    content: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

const ListNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[] | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        fetchNotifications();
    }, [currentPage]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/notifications/all', {
                params: {
                    page: currentPage,
                    per_page: itemsPerPage,
                },
                withCredentials: true,
            });
            setNotifications(response.data.data);
            setTotalPages(response.data.total_pages);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startSerialNumber = totalItems - itemsPerPage * (currentPage - 1);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>List Notifications</h1>
                    <p className='text-[12px]'>You can manage notifications from the Sidebar menu</p>
                </div>
            </div>
            <hr className='-mx-4' />
            <div className="border text-gray-500 w-full p-3 rounded-2xl overflow-x-auto mt-4">
                <table className="w-full table-auto">
                    <thead className="text-left text-[12px]">
                        <tr className="border-b-2">
                            <th className="p-2">No</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Content</th>
                            <th className="p-2">Read</th>
                            <th className="p-2">Received At</th>
                            <th className="p-2">Read At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-2 text-xs justify-center">
                                    <Triangle color="#358BF6" height={20} width={20} />
                                </td>
                            </tr>
                        ) : notifications && notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <tr key={notification.id}>
                                    <td className="p-2 text-xs">{startSerialNumber - index}</td>
                                    <td className="p-2 text-xs">{notification.type}</td>
                                    <td className="p-2 text-xs">{notification.content}</td>
                                    <td className="p-2 text-xs">{notification.read ? 'Yes' : 'No'}</td>
                                    <td className="p-2 text-xs">{formatDate(notification.createdAt)}</td>
                                    <td className="p-2 text-xs">
                                        {notification.updatedAt === notification.createdAt
                                            ? '-'
                                            : formatDate(notification.updatedAt)}
                                    </td>
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

export default ListNotifications;

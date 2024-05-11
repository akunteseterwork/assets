import Link from 'next/link';
import Image from 'next/image';
import superuser from '@/public/superuser.png'
import { RiUserLine, RiGroupLine, RiUserAddLine, RiUserUnfollowLine, RiUserFollowLine, RiDeleteBinLine } from 'react-icons/ri';
import { RiCoupon3Line, RiCoupon2Line, RiCoupon5Line, RiCouponLine, RiCoupon4Line, RiNotificationLine } from 'react-icons/ri';
import { MdOutlineSdStorage, MdOutlineNotifications, MdOutlineNotificationAdd, MdOutlineNotificationsActive, MdOutlineEditNotifications, MdOutlineNotificationsOff } from "react-icons/md";
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../authProvider';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    onItemClick: (item: string) => void;
}

function Sidebar({ onItemClick }: SidebarProps) {
    const { authenticated, username, role } = useContext(AuthContext);
    const [usersOpen, setUsersOpen] = useState(false);
    const [vouchersOpen, setVouchersOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const router = useRouter();

    if (role !== 'superadmin') {
        router.push('/404');
    }

    const handleItemClick = (item: string) => {
        onItemClick(item);
        setSelectedItem(item);
    };

    const handleLogout = async () => {
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/auth/logout', null, { withCredentials: true });
            window.location.href = '/auth';
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

    return (
        <div className='w-60 shrink-0 md:block h-screen sticky top-0 overflow-hidden'>
            <div className='w-full h-full bg-white border'>
                <Link href='/'>
                    <div className='md:p-2 flex cursor-pointer group items-center gap-2'>
                        <div className='flex items-center justify-center rounded-full'>
                            <Image src={superuser} width={100} alt='logo' priority={true} className='relative' />
                        </div>
                    </div>
                </Link>

                <hr className='bg-gray-400 mx-2' />
                <div className='flex flex-col h-3/4 justify-between'>
                    <div className='pt-2 text-gray-500 font-medium space-y-2 md:px-2 text-[14px] overflow-auto'>
                        <ul className="space-y-2 mt-2">
                            <li onClick={() => setUsersOpen(!usersOpen)} className={`cursor-pointer ${selectedItem === 'users' && 'text-blue-600'}`}>
                                <p className="flex hover:text-blue-600 text-xs items-center gap-2 mb-4">
                                    {usersOpen ? <RiGroupLine size={20} /> : <RiGroupLine size={20} />}
                                    Users
                                </p>
                            </li>
                            {usersOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li onClick={() => handleItemClick('list-users')} className={`cursor-pointer ${selectedItem === 'list-users' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiUserLine size={20} />
                                            List Users
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('create-user')} className={`cursor-pointer ${selectedItem === 'create-user' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiUserAddLine size={20} />
                                            Create User
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('banned-users')} className={`cursor-pointer ${selectedItem === 'banned-users' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiUserUnfollowLine size={20} />
                                            Banned User
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('activate-users')} className={`cursor-pointer ${selectedItem === 'activate-users' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiUserFollowLine size={20} />
                                            Activate User
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('delete-users')} className={`cursor-pointer ${selectedItem === 'delete-users' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiDeleteBinLine size={20} />
                                            Delete User
                                        </p>
                                    </li>
                                </ul>
                            )}
                            <li onClick={() => setVouchersOpen(!vouchersOpen)} className={`cursor-pointer ${selectedItem === 'vouchers' && 'text-blue-600'}`}>
                                <p className="flex hover:text-blue-600 text-xs items-center gap-2 mb-4">
                                    {vouchersOpen ? <RiCoupon3Line size={20} /> : <RiCoupon4Line size={20} />}
                                    Vouchers
                                </p>
                            </li>
                            {vouchersOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li onClick={() => handleItemClick('list-vouchers')} className={`cursor-pointer ${selectedItem === 'list-vouchers' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <MdOutlineNotifications size={20} />
                                            List Vouchers
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('create-voucher')} className={`cursor-pointer ${selectedItem === 'create-voucher' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiCoupon2Line size={20} />
                                            Create Voucher
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('edit-voucher')} className={`cursor-pointer ${selectedItem === 'edit-voucher' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiCouponLine size={20} />
                                            Edit Voucher
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('delete-vouchers')} className={`cursor-pointer ${selectedItem === 'delete-vouchers' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <RiCoupon5Line size={20} />
                                            Delete Voucher
                                        </p>
                                    </li>
                                </ul>
                            )}
                            <li onClick={() => setNotificationOpen(!notificationOpen)} className={`cursor-pointer ${selectedItem === 'vouchers' && 'text-blue-600'}`}>
                                <p className="flex hover:text-blue-600 text-xs items-center gap-2 mb-4">
                                    {notificationOpen ? <RiNotificationLine size={20} /> : <RiNotificationLine size={20} />}
                                    Notifications
                                </p>
                            </li>
                            {notificationOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li onClick={() => handleItemClick('list-notifications')} className={`cursor-pointer ${selectedItem === 'list-notifications' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <MdOutlineNotifications size={20} />
                                            List Notifications
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('send-notification')} className={`cursor-pointer ${selectedItem === 'send-notification' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <MdOutlineNotificationAdd size={20} />
                                            Send Notification
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('send-global-notification')} className={`cursor-pointer ${selectedItem === 'send-global-notification' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <MdOutlineNotificationsActive size={20} />
                                            Send Global Notification
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('edit-notification')} className={`cursor-pointer ${selectedItem === 'edit-notification' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <MdOutlineEditNotifications size={20} />
                                            Edit Notification
                                        </p>
                                    </li>
                                    <li onClick={() => handleItemClick('delete-notification')} className={`cursor-pointer ${selectedItem === 'delete-notification' && 'text-blue-600'}`}>
                                        <p className="flex hover:text-blue-600 text-xs font-normal items-center gap-2 mb-4">
                                            <MdOutlineNotificationsOff size={20} />
                                            Delete Notification
                                        </p>
                                    </li>
                                </ul>
                            )}
                            <li onClick={() => handleItemClick('storage-info')} className={`cursor-pointer ${selectedItem === 'storage-info' && 'text-blue-600'}`}>
                                <p className="flex hover:text-blue-600 text-xs items-center gap-2 mb-4">
                                    <MdOutlineSdStorage size={20} />
                                    Storage Info
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div>
                        {authenticated && (
                            <div className='absolute bottom-4 justify-between px-4 md:px-6 items-center hover:pr-5 duration-200'>
                                <div className="mr-4 text-xs text-gray-500 mb-1">Welcome, <span className="font-semibold">{username}</span>!</div>
                                <button className="py-1 px-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;

"use client"
import React, { useState, useContext } from 'react';
import Sidebar from '../components/ui/sidebar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../components/authProvider';
import ListUsers from '../components/users/listUser';
import CreateUser from '../components/users/createUser';
import BannedUser from '../components/users/banUser';
import ActivateUser from '../components/users/activateUser';
import DeleteUser from '../components/users/deleteUser';
import ListVouchers from '../components/vouchers/listVoucher';
import CreateVoucher from '../components/vouchers/createVoucher';
import EditVoucher from '../components/vouchers/editVoucher';
import DeleteVoucher from '../components/vouchers/deleteVoucher';
import StorageInfo from '../components/storageInfo';
import ListNotifications from '../components/notifications/listNotification';
import SendNotification from '../components/notifications/sendNotification';
import SendGlobalNotification from '../components/notifications/sendGlobalNotification';
import EditNotification from '../components/notifications/editNotification';
import DeleteNotification from '../components/notifications/deleteNotification';

const queryClient = new QueryClient();

const DashboardPage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string>('');

    const renderContent = () => {
        switch (selectedItem) {
            case 'list-users':
                return <ListUsers />;
            case 'create-user':
                return <CreateUser onCreateSuccess={() => setSelectedItem('list-users')} />;
            case 'banned-users':
                return <BannedUser onUserBanned={() => setSelectedItem('list-users')} />;
            case 'activate-users':
                return <ActivateUser onUserActive={() => setSelectedItem('list-users')} />;
            case 'delete-users':
                return <DeleteUser onUserDelete={() => setSelectedItem('list-users')} />;
            case 'list-vouchers':
                return <ListVouchers />;
            case 'create-voucher':
                return <CreateVoucher onCreateSuccess={() => setSelectedItem('list-vouchers')} />;
            case 'edit-voucher':
                return <EditVoucher onVoucherEdited={() => setSelectedItem('list-vouchers')} />;
            case 'delete-vouchers':
                return <DeleteVoucher onVoucherDeleted={() => setSelectedItem('list-vouchers')} />;
            case 'list-notifications':
                return <ListNotifications />;
            case 'send-notification':
                return <SendNotification onSendSuccess={() => setSelectedItem('list-notifications')} />;
            case 'send-global-notification':
                return <SendGlobalNotification onSendSuccess={() => setSelectedItem('list-notifications')} />;
            case 'edit-notification':
                return <EditNotification onEditSuccess={() => setSelectedItem('list-notifications')} />;
            case 'delete-notification':
                return <DeleteNotification onDeleteSuccess={() => setSelectedItem('list-notifications')} />;
            case 'storage-info':
                return <StorageInfo />;
            default:
                return <ListUsers />;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <div className="flex h-screen">
                    <Sidebar onItemClick={(item) => setSelectedItem(item)} />
                    <div className="flex-1 p-6 bg-white text-sm text-gray-800">
                        {renderContent()}
                    </div>
                </div>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default DashboardPage;
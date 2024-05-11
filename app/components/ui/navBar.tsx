import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../authProvider';
import { RiCoupon2Line, RiDownloadCloud2Line, RiNotification2Line } from 'react-icons/ri';
import axios from 'axios';

const Navbar: React.FC = () => {
  const { authenticated, username, role } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showRedeemField, setShowRedeemField] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsTotal, setNotificationsTotal] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshNavbar, setRefreshNavbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authenticated) {
      fetchUserProfile();
      fetchNotifications();
    }
  }, [authenticated]);

  useEffect(() => {
    if (refreshNavbar) {
      fetchUserProfile();
      setRefreshNavbar(false);
    }
  }, [refreshNavbar]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        target &&
        !target.classList.contains('voucher-redeem-button') &&
        !target.classList.contains('notification-icon')
      ) {
        setShowRedeemField(false);
        setShowMenu(false);
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!showMenu) {
      setVoucherCode('');
      setErrorMessage('');
    }
  }, [showMenu]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/users/profile', { withCredentials: true });
      setVouchers(response.data.data.vouchers);
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/notifications?read=false', { withCredentials: true });
      setNotifications(response.data.data);
      setNotificationsTotal(response.data.total);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  };


  const refreshNotificationsAndNavbar = () => {
    fetchNotifications();
    setRefreshNavbar(prevState => !prevState);
  };


  const handleLogout = async () => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/auth/logout', null, { withCredentials: true });
      window.location.href = '/auth';
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const remainingQuota = vouchers.reduce((total: number, voucher: any) => total + voucher.remaining, 0);

  const redeemVoucher = async () => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/vouchers/redeem', { code: voucherCode }, { withCredentials: true });
      setVoucherCode('');
      setShowRedeemField(false);
      setErrorMessage('');
      fetchUserProfile();
    } catch (error: any) {
      console.log('Error redeeming voucher:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred while redeeming the voucher.');
      }
    }
  };

  const handleReadNotification = async (notificationId: string) => {
    try {
      await axios.put(process.env.NEXT_PUBLIC_API_URL + `/api/notifications/read/${notificationId}`, null, { withCredentials: true });
      refreshNotificationsAndNavbar();
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };


  useEffect(() => {
    const refreshNavbar = () => {
      fetchUserProfile();
    };
    document.addEventListener('refreshNavbar', refreshNavbar);
    return () => {
      document.removeEventListener('refreshNavbar', refreshNavbar);
    };
  }, []);

  return (
    <nav className="bg-gray-100 p-4 text-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm font-semibold">Premium Asset Downloader</div>
        <div className="flex items-center">
          {authenticated && (
            <>
              <div className="mr-2 relative text-xs">
                Welcome, <span className="font-semibold">{username}</span>!
              </div>
              <div className="mr-4 relative">
                <RiNotification2Line className="cursor-pointer text-lg notification-icon" onClick={() => setShowNotifications(!showNotifications)} />
                {notificationsTotal > 0 && !showNotifications && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1 cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                    {notificationsTotal}
                  </span>
                )}
              </div>

            </>
          )}
          {showNotifications && (
            <div className='relative'>
              <div className="absolute bg-white border top-4 right-1 border-gray-200 rounded-xl w-48 shadow-lg py-2 text-xs" ref={menuRef}>
              {notifications.length > 0 ? (
  notifications.map((notification: any) => (
    <div key={notification.id} className="px-3 py-1 relative">
      <div className="text-gray-800 font-semibold text-[10px]">{notification.type}</div>
      <div className="text-gray-500 text-[10px]">{notification.content}</div>
      <div className="text-gray-500 text-[8px]">{new Date(notification.updatedAt).toISOString().replace('T', ' ').slice(0, -5)}</div>
      <hr className="my-1" />
      <button
        className="text-blue-500 font-semibold text-[8px] absolute bottom-3 right-2 mt-1 mr-1"
        onClick={() => handleReadNotification(notification.id)}
      >
        Read
      </button>
    </div>
  ))
) : (
  <div className="px-3 py-1 text-gray-500">No notifications</div>
)}


              </div>
            </div>
          )}
          <div className="md:hidden cursor-pointer" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                className={showMobileMenu ? 'hidden' : 'block'}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
              />
            </svg>
          </div>
          <div className={showMobileMenu ? 'block md:flex' : 'hidden md:flex'}>
            {authenticated ? (
              <>
                <div className="relative" ref={menuRef}>
                {remainingQuota > 0 && (
                  <span className="absolute -top-1 right-2 bg-green-500 text-white text-[12px] rounded-full px-1">
                    {remainingQuota}
                  </span>
                )}
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="mr-4 py-1 px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs flex items-center"
                  >
                    <RiCoupon2Line className="mr-1 voucher-redeem-button" />
                    My Vouchers
                  </button>
                  {showMenu && (
                    <div className="absolute bg-white border border-gray-200 rounded-xl shadow-lg mt-1 py-2 w-48 text-sm">
                      {vouchers.map((voucher: any) => (
                        <div key={voucher.code} className="px-4 py-2">
                          <div className="flex justify-between text-xs items-center">
                            <div className="flex items-center">
                              <RiCoupon2Line size={15} className="mr-2" />
                              <div className="text-gray-600">{voucher.name}</div>
                            </div>
                            <div className="flex items-center">
                              <RiDownloadCloud2Line size={15} className="mr-2 text-gray-600" />
                              <div className="text-gray-600">{voucher.remaining}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-2">
                        <p className='text-gray-500 text-[10px]'>Have a voucher code?</p>
                        {!showRedeemField && (
                          <button className="bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700 text-[11px]" onClick={() => setShowRedeemField(true)}>
                            Redeem Voucher
                          </button>
                        )}
                        {showRedeemField && (
                          <div>
                            <input
                              type="text"
                              placeholder="Enter voucher code"
                              className="border rounded-md px-2 py-1 text-[11px] mt-1 mb-2 mr-2"
                              value={voucherCode}
                              onChange={(e) => setVoucherCode(e.target.value)}
                            />
                            <button className="bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700 text-[11px]" onClick={redeemVoucher}>
                              Redeem
                            </button>
                            {errorMessage && (
                              <p className="text-red-500 text-[10px] italic mt-1">{errorMessage}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {role === 'superadmin' && (
                  <button
                    onClick={() => { window.location.href = '/dashboard'; }}
                    className="mr-4 py-1 px-3 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  >
                    Dashboard
                  </button>
                )}
                <button onClick={handleLogout} className="py-1 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs">
                  Logout
                </button>
              </>
            ) : (
              <div>Not logged in</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

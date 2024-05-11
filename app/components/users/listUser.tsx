import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Triangle } from 'react-loader-spinner';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('username');
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        params: {
          page: currentPage,
          per_page: itemsPerPage,
          [searchParam]: searchTerm,
        },
        withCredentials: true,
      });
      setUsers(response.data.data);
      setTotalPages(response.data.pagination.total_page);
      setTotalItems(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
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
          <h1 className='text-sm'>List Users</h1>
          <p className='text-[12px]'>You can manage users from the Sidebar menu</p>
        </div>
      </div>
      <hr className='-mx-4' />
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mt-2 w-half">
          <select value={searchParam} onChange={handleParamChange} className="border rounded-md px-3 py-2 text-xs mr-2">
            <option value="username">Username</option>
            <option value="email">Email</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchParam === 'username' ? 'username' : 'email'}...`}
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
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-2 text-xs justify-center">
                  <Triangle color="#358BF6" height={20} width={20} />
                </td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="p-2 text-xs">{startSerialNumber - index}</td>
                  <td className="p-2 text-xs">{user.username}</td>
                  <td className="p-2 text-xs">{user.email}</td>
                  <td className={`p-2 text-xs ${user.role === 'superadmin' ? 'text-purple-700' : 'text-gray-700'}`}>{user.role}</td>
                  <td className={`p-2 text-xs ${user.status === 'banned' ? 'text-red-700' : 'text-green-700'}`}>{user.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-xs">No data found</td>
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

export default ListUsers;

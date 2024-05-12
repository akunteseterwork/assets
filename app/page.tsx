"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './components/authProvider';
import Navbar from './components/ui/navBar';
import { Triangle } from 'react-loader-spinner';

const queryClient = new QueryClient();

const IndexPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('Freepik');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadData, setDownloadData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/downloads', {
        params: {
          page: currentPage,
          per_page: 10,
          name: searchTerm,
        },
        withCredentials: true,
      });
      setDownloadData(response.data);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      setError('An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/api/freepik',
        { url: url }, {
        withCredentials: true
      }
      );
      setApiResponse(response.data);
      setUrl('');
      setError('');
      fetchData();
      setTimeout(() => {
        refreshNavbar();
      }, 3000);

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNavbar = () => {
    document.dispatchEvent(new Event('refreshNavbar'));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className={`min-h-screen bg-gray-100 flex flex-col ${isLoading ? 'relative' : ''}`}>
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <Triangle color='#2564eb' width={50} />
            </div>
          )}
          <Navbar />
          <div className="flex-grow flex flex-col justify-start pt-6 items-center">
            <div className="max-w-xl w-full px-10">
              <h1 className="text-sm font-semibold mb-4 text-center text-gray-800">Paste the URL below then click Download</h1>
              <div className="flex justify-center items-center mb-2">
                <select
                  id="service"
                  value={selectedService}
                  onChange={handleServiceChange}
                  className="p-2 border border-gray-300 rounded-lg text-xs text-gray-900 mr-2"
                >
                  <option value="Freepik">Freepik</option>
                  <option value="Shutterstock">Envato</option>
                </select>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={handleUrlChange}
                  className="p-2 border border-gray-300 rounded-lg flex-grow text-xs text-gray-900"
                  placeholder="Enter URL"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ml-2 text-xs"
                >
                  Download
                </button>
              </div>
              <div className="flex justify-center items-center mb-2">
                {error && <p className="text-red-600 text-[10px] italic">{error}</p>}
              </div>
              <p className="text-[10px] text-gray-400 italic">Example URL: <a href="https://www.freepik.com/free-vector/game-streamer-concept-elements-illustrated_13597630.htm" target="_blank" rel="noopener noreferrer">https://www.freepik.com/free-vector/game-streamer-concept-elements-illustrated_13597630.htm</a></p>
            </div>
            {apiResponse && (
              <div className="max-w-xl w-full px-10 mt-4">
                <button
                  onClick={() => window.open(apiResponse.data.directlink, '_blank')}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full text-xs"
                >
                  Download {apiResponse.data.name}
                </button>
              </div>
            )}

            <div className="border text-gray-500 w-full p-3 bg-white shadow-sm rounded-2xl overflow-x-auto mt-4 md:w-full md:min-w-[1000px] md:max-w-[1000px]">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg flex-grow text-xs text-gray-900 mb-2"
              />
              <div className="table-container">
                <table className="w-full table-auto">
                  <thead className="text-left text-[12px]">
                    <tr className="border">
                      <th className="p-2">No</th>
                      <th className="p-2 min-w-[150px]">Name</th>
                      <th className="p-2">URL</th>
                      <th className="p-2">Status</th>
                      <th className="p-2 min-w-[150px]">Downloaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="p-2 text-center">
                          <Triangle color="#358BF6" height={20} width={20} />

                        </td>
                      </tr>
                    ) : downloadData && downloadData.data !== null && downloadData.data.length > 0 ? (
                      downloadData.data.map((download: any, index: number) => (
                        <tr key={download.id} className="border-b">
                          <td className="p-2 text-xs">{totalPages - (10 * (currentPage - 1) + index)}</td>
                          <td className="p-2 text-xs">{download.filename}</td>
                          <td className="p-2 text-xs">{download.url}</td>
                          <td className={`p-2 text-xs font-semibold ${download.status === 'completed' ? 'text-green-600' : (download.status === 'waiting' ? 'text-purple-600' : 'text-red-600')}`}>{download.status}</td>
                          <td className="p-2 text-xs">{formatDate(download.updatedAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-2 text-red-600 text-xs italic">Download not found</td>
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

          </div>
          <footer className="bg-gray-100 text-center py-2 text-[10px] text-gray-600">
            Made for 💵 by mzhll
          </footer>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default IndexPage;

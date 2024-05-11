import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Triangle } from 'react-loader-spinner';
import { AiOutlineCloud } from 'react-icons/ai';
import DonutChart from './ui/donut';

const StorageInfo: React.FC = () => {
    const [storageInfo, setStorageInfo] = useState<any>({});
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const storageResponse = await axios.get(process.env.NEXT_PUBLIC_API_URL+'/api/drive/storage');
            const filesResponse = await axios.get(process.env.NEXT_PUBLIC_API_URL+'/api/drive/files');
            setStorageInfo(storageResponse.data.data);
            setFileList(filesResponse.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (value: string, limit: string): number => {
        const valueInGB = parseFloat(value.split(' ')[0]);
        const limitInGB = parseFloat(limit.split(' ')[0]);
        return (valueInGB / limitInGB) * 100;
    };

    return (
        <div className='border text-gray-500 w-half p-3 rounded-2xl'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <AiOutlineCloud size={20} />
                    <p className='text-gray-800 font-medium'>Storage Info</p>
                </div>
            </div>
            <hr className='-mx-4 my-4 bg-gray-400' />
            <div className='max-w-screen-sm w-half'>
                <div className="mb-4">
                    <p className='text-sm text-gray-800 font-semibold mb-1'>Storage 1</p>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-md bg-gray-200" style={{ backgroundColor: '#FFCE56' }}></div>
                        <p className="text-[10px]">Used {storageInfo.usage}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-md bg-gray-200" style={{ backgroundColor: '#8ADE7A' }}></div>
                        <p className="text-[10px]">Remaining {storageInfo.remaining}</p>
                    </div>
                    <p className='text-[10px] italic text-gray-400'>
                        Data retrieved from Google Drive API.
                    </p>
                </div>
                {loading ? (
                    <div className='flex justify-center'>
                        <Triangle color="#7B6CF0" />
                    </div>
                ) : Object.keys(storageInfo).length > 0 ? (
                    <>
                        <div className="flex gap-8">
                            <div className="mb-4" style={{ maxWidth: '200px' }}>
                                <DonutChart
                                    data={{
                                        'Used': calculatePercentage(storageInfo.usage, storageInfo.limit),
                                        'Remaining': calculatePercentage(storageInfo.remaining, storageInfo.limit),
                                    }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className='border text-gray-500 w-half p-3 rounded-2xl'>
                                    <p className="text-[12px] font-semibold mb-1">Latest Files</p>
                                    <hr className='-mx-4 mb-1 bg-gray-400' />
                                    {fileList.slice(0, 3).map((file: any) => (
                                        <div key={file.name} className="mb-1">
                                            <a href={file.directlink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-[12px] hover:underline">{file.name}</a>
                                            <p className="text-[10px] text-gray-400">Uploaded at: {new Date(file.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <div className='text-xs flex text-center'>No data</div>
                )}
            </div>
        </div>
    );
};

export default StorageInfo;

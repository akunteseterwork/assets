import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface CreateUserProps {
    onCreateSuccess: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onCreateSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL+'/api/users', userData, { withCredentials: true });
            setUserData({
                username: '',
                email: '',
                password: ''
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className='text-sm md:pb-2 text-gray-600 flex items-center justify-between'>
                <div>
                    <h1 className='text-sm'>Create User</h1>
                    <p className='text-[12px]'>Please fill in the details carefully</p>
                </div>
            </div>
            <hr className='-mx-4' />
            <form className="mt-4 max-w-screen-sm w-full" onSubmit={handleFormSubmit}>
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-800">Username</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                        placeholder="Enter username"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-800">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                        placeholder="Enter email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-800">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full border rounded-md px-3 py-2 text-xs mt-1"
                            placeholder="Enter password"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute top-0 mt-[10px] right-0 px-2 py-1"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                </div>
                {errorMessage && (
                    <p className="text-xs italic text-red-500 mb-4">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-xs"
                >
                    Create User
                </button>

            </form>
        </div>
    );
};

export default CreateUser;

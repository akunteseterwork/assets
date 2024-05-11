"use client";
import React, { useState } from 'react';
import axios from 'axios';
import stock from '../../public/stock.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL+'/api/auth', {
        username,
        password,
      }, { withCredentials: true });
      document.cookie = `access_token=${response.data.access_token}; Path=/; HttpOnly`;
      setError('');
      window.location.href = '/';
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setError('You are banned from using this service');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-login-image">
      <div className="max-w-screen-md w-full shadow-lg rounded-2xl flex">
        <div className="hidden lg:block lg:w-1/2 bg-white rounded-2xl">
          <img
            src={stock.src}
            alt="Login Image"
            className="w-half h-half p-8"
          />
        </div>
        <div className="w-full lg:w-1/2 px-8 py-12 bg-white text-gray-900 content-center rounded-2xl">
          <h2 className="text-md font-semibold mb-4 text-center">Login to Asset Downloader</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-4 w-full">
              <label htmlFor="username" className="block text-xs font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="mt-1 p-2 border border-gray-300 text-xs rounded-md w-full"
              />
            </div>
            <div className="mb-4 relative w-full">
              <label htmlFor="password" className="block text-xs font-medium">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 p-2 pr-10 border border-gray-300 text-xs rounded-md w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pt-5 pr-3 flex items-center focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <AiOutlineEye className="h-4 w-4 text-gray-400" />
                ) : (
                  <AiOutlineEyeInvisible className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 text-xs rounded-md">
              Login
            </button>
            {error && <p className="text-red-500 mt-2 text-[12px] italic">{error}</p>}
          </form>
          <p className="text-[10px] text-gray-400 italic mt-4">Can't login? contact{' '} <a href="https://wa.me/+6285643042886" target="_blank" rel="noopener noreferrer">
            <span className="text-blue-500 font-normal">
              <b>Administrator</b>
            </span>
          </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

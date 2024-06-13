'use client';

import { FormEvent, useState } from 'react';
import { setToken, setUser } from '@/redux/auth/auth.slice';
import useAuthSession from '../hooks/useAuthSession';
import { useAppDispatch } from '@/redux/store';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const user = useAuthSession();

  const handleLogin = async () => {
    try {

      if (username.length < 1 || password.length < 6 ) {
        toast.error('Enter valid credentials');
        return;
      }
  
      const response = await axios.post('/api/auth/login', {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });


      const data = await response.data

      dispatch(setToken(data.token));
      dispatch(setUser(data.user));

      setUsername('');
      setPassword('');

      toast.success(data.message);

    } catch (error: any) {
      toast.error(error.response.data.message ? error.response.data.message : error.message);
    }
  }


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 className="text-xl font-bold">Welcome, {user.username}</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 mt-4 border text-black rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              placeholder="Password"
              className="w-full px-4 py-2 mt-4 border text-black rounded-md"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
          </div>
        )}
        <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
          <h3 className="text-lg font-semibold">The hook should be usable like this: </h3>
          <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
            <code>
              {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
            </code>
          </pre>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default HomePage;

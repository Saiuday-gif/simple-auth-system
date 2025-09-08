import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/register',
        { email, password },
        { withCredentials: true }
      );

      if (res.data.message === 'User registered successfully') {
        setMessage('✅ Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <label className="block mb-4">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 ${
            message.includes('successful') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;

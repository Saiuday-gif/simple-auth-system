import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Link } from "react-router-dom";
import axios from 'axios';

// Create a context to manage the authentication state.
const AuthContext = createContext(null);

// --- ProtectedRoute Component ---
const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- Home Component ---
const Home = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
    <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
    <p className="text-lg text-gray-700">Please use the navigation links to log in or register.</p>
  </div>
);

// --- Login Component ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      
      if (res.data.success) {
        setAuth(true); // Set authentication state to true
        navigate('/dashboard');
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
    <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
        <label className="flex flex-col">
          Email
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="p-2 border rounded-md"
          />
        </label>
        <label className="flex flex-col">
          Password
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="p-2 border rounded-md"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">Login</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      <p className="mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
      </p>
    </div>
  );
};

// --- Register Component ---
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/register', { email, password });

      if (res.data.success) {
        setTimeout(() => navigate('/login'), 2000);
      } else {
      }
    } catch (err) {
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
    <form onSubmit={handleRegister} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
        <label className="flex flex-col">
          Email
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="p-2 border rounded-md"
          />
        </label>
        <label className="flex flex-col">
          Password
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="p-2 border rounded-md"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">Register</button>
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(false); // Clear authentication state
    // In a real app, you would also clear the JWT token from local storage or cookies here.
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-4">Welcome to the Dashboard!</h2>
      <p className="text-lg text-gray-700 mb-6">You have successfully logged in and are viewing a protected page.</p>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white p-2 px-4 rounded-md hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

// --- App Component (Main) ---
const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <BrowserRouter>
        <nav className="p-4 bg-gray-800 text-white">
          <ul className="flex justify-center gap-6">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            {!auth && <li><Link to="/login" className="hover:underline">Login</Link></li>}
            {!auth && <li><Link to="/register" className="hover:underline">Register</Link></li>}
            {auth && <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;

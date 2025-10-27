// src/pages/admin/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import ieeeSpgLogo from '../../assets/images/ieee-sps-logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="min-h-screen flex flex-col">
      {/* Clean top bar */}
      <div className="h-20 bg-[#0077B5] w-full"></div>
      
      {/* Main content area with subtle background */}
      <div className="flex-grow bg-gray-50 flex items-center justify-center">
        {/* Login Card */}
        <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header with IEEE blue */}
          <div className="bg-[#0077B5] h-2 w-full"></div>
          
          <div className="px-6 py-12">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-8">
              <img src={ieeeSpgLogo} alt="IEEE SPS Gujarat Section" className="h-20 mb-4" />
              <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
              <p className="mt-2 text-gray-600 text-center">
                Sign in to access the IEEE SPS Gujarat Section admin panel
              </p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            

            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5] sm:text-sm"
                    placeholder="your-email@ieee.org"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0077B5] focus:ring-[#0077B5] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-[#0077B5] hover:text-[#8DC63F]">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0077B5] hover:bg-[#00588a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B5] ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} IEEE Signal Processing Society Gujarat Section
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="h-4 bg-[#8DC63F] w-full"></div>
    </div>
  );
};

export default LoginPage;
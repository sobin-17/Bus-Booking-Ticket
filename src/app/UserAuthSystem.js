import React, { useState } from 'react';
import { User, Lock, Mail, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';

const UserAuthSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    emailId: '',
    fullName: '',
    projectName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage(''); // Clear messages when user types
  };

  const validateForm = () => {
    if (!formData.userName || !formData.password) {
      setMessage('Username and password are required');
      return false;
    }
    
    if (!isLogin) {
      if (!formData.emailId || !formData.fullName) {
        setMessage('All fields are required for registration');
        return false;
      }
      if (formData.password.length < 6) {
        setMessage('Password must be at least 6 characters long');
        return false;
      }
    }
    
    return true;
  };

  const registerUser = async () => {
    try {
      const response = await fetch('https://api.freeprojectapi.com/api/BusBooking/AddNewUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
          emailId: formData.emailId,
          fullName: formData.fullName,
          projectName: formData.projectName || 'Default Project',
          role: 'User'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Registration successful! You can now login.');
        setIsLogin(true);
        setFormData({ ...formData, password: '' }); // Clear password
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Registration error:', error);
    }
  };

  const loginUser = async () => {
    try {
      // Since the API might not have a separate login endpoint, 
      // this is a mock implementation. You'd need to adjust based on actual API
      const response = await fetch('https://api.freeprojectapi.com/api/BusBooking/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setMessage('Login successful!');
        
        // Store token if provided
        if (data.refreshToken) {
          // In a real app, store this securely
          console.log('Refresh token:', data.refreshToken);
        }
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      if (isLogin) {
        await loginUser();
      } else {
        await registerUser();
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userName: '',
      password: '',
      emailId: '',
      fullName: '',
      projectName: ''
    });
    setMessage('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const logout = () => {
    setUserData(null);
    resetForm();
    setMessage('Logged out successfully');
  };

  // If user is logged in, show user info
  if (userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <User className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-semibold">{userData.userName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold">{userData.fullName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{userData.emailId}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-semibold">{userData.role}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            {isLogin ? <LogIn className="text-indigo-600" size={32} /> : <UserPlus className="text-indigo-600" size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Registration fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required={!isLogin}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter project name (optional)"
                />
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.includes('successful') || message.includes('Welcome')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </div>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={switchMode}
              className="text-indigo-600 hover:text-indigo-700 font-semibold ml-2"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAuthSystem;
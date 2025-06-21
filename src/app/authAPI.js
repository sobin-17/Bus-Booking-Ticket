// API Configuration
const API_BASE_URL = 'https://api.freeprojectapi.com/api/BusBooking';

// API Functions for User Management

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.userName - Username
 * @param {string} userData.password - Password
 * @param {string} userData.emailId - Email address
 * @param {string} userData.fullName - Full name
 * @param {string} userData.projectName - Project name (optional)
 * @returns {Promise} API response
 */
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/AddNewUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        userName: userData.userName,
        password: userData.password,
        emailId: userData.emailId,
        fullName: userData.fullName,
        projectName: userData.projectName || 'Default Project',
        role: userData.role || 'User'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return {
      success: true,
      data: data,
      message: 'User registered successfully'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Registration failed'
    };
  }
}

/**
 * Login user (Note: This endpoint might not exist, adjust according to actual API)
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.userName - Username
 * @param {string} credentials.password - Password
 * @returns {Promise} API response
 */
async function loginUser(credentials) {
  try {
    // Since the API might not have a separate login endpoint,
    // you might need to use a different approach or endpoint
    const response = await fetch(`${API_BASE_URL}/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        userName: credentials.userName,
        password: credentials.password
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }
    
    // Store refresh token if provided
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('refreshTokenExpiry', data.refreshTokenExpiryTime);
    }
    
    return {
      success: true,
      data: data,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Login failed'
    };
  }
}

/**
 * Get user profile (if endpoint exists)
 * @param {number} userId - User ID
 * @returns {Promise} API response
 */
async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/GetUser/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getStoredToken()}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }
    
    return {
      success: true,
      data: data,
      message: 'Profile fetched successfully'
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch profile'
    };
  }
}

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} API response
 */
async function updateUserProfile(userId, updateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/UpdateUser/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getStoredToken()}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    return {
      success: true,
      data: data,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update profile'
    };
  }
}

/**
 * Refresh authentication token
 * @returns {Promise} API response
 */
async function refreshAuthToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/RefreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to refresh token');
    }
    
    // Update stored tokens
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('refreshTokenExpiry', data.refreshTokenExpiryTime);
    
    return {
      success: true,
      data: data,
      message: 'Token refreshed successfully'
    };
  } catch (error) {
    console.error('Refresh token error:', error);
    // Clear invalid tokens
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiry');
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to refresh token'
    };
  }
}

/**
 * Logout user
 */
function logoutUser() {
  // Clear stored tokens
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refreshTokenExpiry');
  localStorage.removeItem('userData');
  
  // Redirect to login page or refresh the app
  window.location.reload();
}

// Utility Functions

/**
 * Get stored authentication token
 * @returns {string|null} Stored token
 */
function getStoredToken() {
  return localStorage.getItem('refreshToken');
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
  const token = getStoredToken();
  const expiry = localStorage.getItem('refreshTokenExpiry');
  
  if (!token || !expiry) {
    return false;
  }
  
  // Check if token is expired
  const expiryDate = new Date(expiry);
  const now = new Date();
  
  if (now > expiryDate) {
    // Token expired, clear storage
    logoutUser();
    return false;
  }
  
  return true;
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {boolean} isRegistration - Whether this is registration or login
 * @returns {Object} Validation result
 */
function validateFormData(formData, isRegistration = false) {
  const errors = [];
  
  // Common validations
  if (!formData.userName || formData.userName.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (!formData.password || formData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  // Registration-specific validations
  if (isRegistration) {
    if (!formData.emailId || !isValidEmail(formData.emailId)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Export functions for use in other modules
// (Remove this if not using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    refreshAuthToken,
    logoutUser,
    getStoredToken,
    isAuthenticated,
    validateFormData
  };
}

// Usage Examples:

/*
// Registration Example
const registrationData = {
  userName: 'johndoe',
  password: 'securepassword123',
  emailId: 'john@example.com',
  fullName: 'John Doe',
  projectName: 'My Project'
};

registerUser(registrationData)
  .then(result => {
    if (result.success) {
      console.log('Registration successful:', result.data);
      // Redirect to login or dashboard
    } else {
      console.error('Registration failed:', result.error);
      // Show error message to user
    }
  });

// Login Example
const loginCredentials = {
  userName: 'johndoe',
  password: 'securepassword123'
};

loginUser(loginCredentials)
  .then(result => {
    if (result.success) {
      console.log('Login successful:', result.data);
      // Store user data and redirect to dashboard
      localStorage.setItem('userData', JSON.stringify(result.data));
    } else {
      console.error('Login failed:', result.error);
      // Show error message to user
    }
  });

// Check authentication status
if (isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User needs to log in');
  // Redirect to login page
}
*/
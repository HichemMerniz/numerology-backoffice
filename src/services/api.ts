import { API_BASE_URL } from '@/config/api';

// Register User
export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
};

// Login User
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

// Fetch Numerology Data
export const getNumerologyData = async (token: string, name: string, dob: string) => {
  const response = await fetch(`${API_BASE_URL}/api/numerology`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, dob }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch numerology data');
  }

  return response.json();
};

// Generate PDF Report
export const generateNumerologyPDF = async (token: string, name: string, dob: string) => {
  const response = await fetch(`${API_BASE_URL}/api/pdf/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, dob }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  return response.json();
};
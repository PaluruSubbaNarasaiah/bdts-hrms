import { API_URL } from '../config.js';

const handleApiError = (error) => {
  console.error('API Error:', error);
  throw new Error('Network error occurred');
};

const validateResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const apiCall = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data),
      redirect: 'follow'
    });
    
    const responseText = await response.text();
    
    if (responseText.includes('<HTML>') || responseText.includes('<!DOCTYPE html>')) {
      throw new Error('API endpoint error');
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    handleApiError(error);
  }
};

export const loginWithTiming = async (empId, password) => {
  const loginTime = new Date().toISOString();
  const response = await apiCall({
    action: 'login',
    empId,
    password,
    loginTime
  });
  
  if (response.status === 'success') {
    sessionStorage.setItem('loginTime', loginTime);
  }
  
  return response;
};

export const logoutWithTiming = async () => {
  const empId = sessionStorage.getItem('empId');
  const loginTime = sessionStorage.getItem('loginTime');
  const logoutTime = new Date().toISOString();
  
  if (empId && loginTime) {
    await apiCall({
      action: 'logout',
      empId,
      loginTime,
      logoutTime
    });
  }
};

export const getAttendance = async (empId, month, year) => {
  return apiCall({
    action: 'getAttendance',
    empId,
    month,
    year
  });
};

export const punchIn = async () => {
  return apiCall({
    action: 'punchIn',
    empId: sessionStorage.getItem('empId'),
    name: sessionStorage.getItem('name')
  });
};

export const punchOut = async () => {
  return apiCall({
    action: 'punchOut',
    empId: sessionStorage.getItem('empId'),
    name: sessionStorage.getItem('name')
  });
};

export const breakStart = async () => {
  return apiCall({
    action: 'breakStart',
    empId: sessionStorage.getItem('empId'),
    name: sessionStorage.getItem('name')
  });
};

export const breakEnd = async () => {
  return apiCall({
    action: 'breakEnd',
    empId: sessionStorage.getItem('empId'),
    name: sessionStorage.getItem('name')
  });
};

export const getTimings = async () => {
  return apiCall({
    action: 'getTimings',
    empId: sessionStorage.getItem('empId')
  });
};

export const getLeaves = async () => {
  return apiCall({
    action: 'getLeaves',
    empId: sessionStorage.getItem('empId')
  });
};

export const faceAttendance = async (imageData) => {
  return apiCall({
    action: 'faceAttendance',
    empId: sessionStorage.getItem('empId'),
    name: sessionStorage.getItem('name'),
    imageData: imageData
  });
};

export const apiGet = async (params) => {
  try {
    const url = new URL(API_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url);
    return await validateResponse(response);
  } catch (error) {
    handleApiError(error);
  }
};
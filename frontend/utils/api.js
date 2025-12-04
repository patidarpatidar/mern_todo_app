import axios from 'axios';
import Cookie from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookie.get('token');
  console.log('[API] Token from cookie:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error logging
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('[API] Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await apiClient.post('/api/auth/login', { username, password });
  return response.data;
};

export const getTodos = async () => {
  const response = await apiClient.get('/api/todos');
  return response.data;
};

export const addTodo = async (todo) => {
  const response = await apiClient.post('/api/todos/add', { todo });
  return response.data;
};

export const updateTodo = async (id, todo, completed) => {
  const response = await apiClient.put(`/api/todos/${id}`, { todo, completed });
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await apiClient.delete(`/api/todos/${id}`);
  return response.data;
};

export const signup = async (username, password, email, firstName, lastName) => {
  const response = await apiClient.post('/api/auth/signup', {
    username,
    password,
    email,
    firstName,
    lastName,
  });
  return response.data;
};

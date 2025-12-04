import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

const axios = require('axios');

const DUMMYJSON_API = process.env.DUMMYJSON_API_URL;
const getTodos = async (req, res) => {
  try {
    const { id } = req.user;

    const response = await axios.get(`${DUMMYJSON_API}/todos/user/${id}`);

    res.json({
      success: true,
      todos: response.data.todos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};

const addTodo = async (req, res) => {
  try {
    const { id } = req.user;
    const { todo } = req.body;

    if (!todo) {
      return res.status(400).json({ message: 'Todo text required' });
    }

    const response = await axios.post(`${DUMMYJSON_API}/todos/add`, {
      todo,
      completed: false,
      userId: id,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add todo' });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { todo, completed } = req.body;

    console.log('[updateTodo] Request:', { id, todo, completed });

    if (!id) {
      return res.status(400).json({ message: 'Todo ID required' });
    }

    const response = await axios.put(`${DUMMYJSON_API}/todos/${id}`, {
      todo,
      completed,
    });

    console.log('[updateTodo] DummyJSON response:', response.status);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('[updateTodo] Error:', error.response?.status, error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to update todo', error: error.response?.data || error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Todo ID required' });
    }

    const response = await axios.delete(`${DUMMYJSON_API}/todos/${id}`);

    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };

const axios = require('axios');

const DUMMYJSON_API = process.env.DUMMYJSON_API_URL;

// Get all todos for a user
const getTodos = async (req, res) => {
  try {
    const { id } = req.user;

    // Get todos from DummyJSON API
    const response = await axios.get(`${DUMMYJSON_API}/todos/user/${id}`);

    res.json({
      success: true,
      todos: response.data.todos,
    });
  } catch (error) {
    console.error('Get todos error:', error.message);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};

// Add a new todo
const addTodo = async (req, res) => {
  try {
    const { id } = req.user;
    const { todo } = req.body;

    if (!todo) {
      return res.status(400).json({ message: 'Todo text required' });
    }

    // Add todo via DummyJSON API
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
    console.error('Add todo error:', error.message);
    res.status(500).json({ message: 'Failed to add todo' });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { todo, completed } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Todo ID required' });
    }

    // Update todo via DummyJSON API
    const response = await axios.put(`${DUMMYJSON_API}/todos/${id}`, {
      todo,
      completed,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Update todo error:', error.message);
    res.status(500).json({ message: 'Failed to update todo' });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Todo ID required' });
    }

    // Delete todo via DummyJSON API
    const response = await axios.delete(`${DUMMYJSON_API}/todos/${id}`);

    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Delete todo error:', error.message);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };

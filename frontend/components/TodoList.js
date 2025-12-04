import { useEffect, useState } from 'react';
import { getTodos, deleteTodo, updateTodo } from '../utils/api';
import styles from '../styles/TodoList.module.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTodos();
      if (response.success) {
        setTodos(response.todos || []);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();

    // Listen for todo added event
    const handleTodoAdded = () => {
      fetchTodos();
    };

    window.addEventListener('todoAdded', handleTodoAdded);
    return () => window.removeEventListener('todoAdded', handleTodoAdded);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTodo(id);
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleToggle = async (todo) => {
    try {
      await updateTodo(todo.id, todo.todo, !todo.completed);
      setTodos(
        todos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      
      {todos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {todos.map((todo) => (
            <div key={todo.id} className={styles.todoItem}>
              <div className={styles.todoContent}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className={styles.checkbox}
                />
                <span
                  className={`${styles.todoText} ${
                    todo.completed ? styles.completed : ''
                  }`}
                >
                  {todo.todo}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

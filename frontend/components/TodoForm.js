import { useState, useEffect } from 'react';
import { getTodos, addTodo } from '../utils/api';
import styles from '../styles/TodoForm.module.css';

export default function TodoForm() {
  const [todoText, setTodoText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!todoText.trim()) {
      setError('Please enter a task');
      return;
    }

    setLoading(true);
    try {
      console.log('Adding todo:', todoText);
      await addTodo(todoText);
      console.log('Todo added successfully');
      setTodoText('');
      
      // Trigger a refresh of the todo list
      window.dispatchEvent(new Event('todoAdded'));
    } catch (err) {
      console.error('Error adding todo:', err);
      setError(err.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Add a new task..."
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

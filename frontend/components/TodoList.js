import { useEffect, useState } from 'react';
import { getTodos, deleteTodo, updateTodo } from '../utils/api';
import styles from '../styles/TodoList.module.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTodos();
      if (response.success) {
        setTodos(response.todos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();

    const handleTodoAdded = (e) => {
    
      try {
        const created = e?.detail;
        if (created && created.id) {
          setTodos((prev) => [created, ...prev]);
          return;
        }
      } catch (err) {
        }

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

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.todo);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (todo) => {
    if (!editText.trim()) {
      setError('Task text cannot be empty');
      return;
    }

    try {
      const resp = await updateTodo(todo.id, editText, todo.completed);
      setTodos(
        todos.map((t) => (t.id === todo.id ? { ...t, todo: editText } : t))
      );
      setEditingId(null);
      setEditText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
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

                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={styles.editInput}
                    />
                    <button onClick={() => saveEdit(todo)} className={styles.saveBtn}>
                      Save
                    </button>
                    <button onClick={cancelEdit} className={styles.cancelBtn}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`${styles.todoText} ${
                        todo.completed ? styles.completed : ''
                      }`}
                    >
                      {todo.todo}
                    </span>
                    <button onClick={() => startEdit(todo)} className={styles.editBtn}>
                      Edit
                    </button>
                  </>
                )}
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

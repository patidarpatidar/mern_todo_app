import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import LogoutWarning from '../components/LogoutWarning';
import styles from '../styles/Dashboard.module.css';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const WARNING_TIMEOUT = 60 * 1000; // 60 seconds

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(60);
  const inactivityTimer = useRef(null);
  const warningTimer = useRef(null);
  const countdownInterval = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const setupInactivityTracking = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);

      inactivityTimer.current = setTimeout(() => {
        setShowLogoutWarning(true);
        setCountdownSeconds(60);

        countdownInterval.current = setInterval(() => {
          setCountdownSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval.current);
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, INACTIVITY_TIMEOUT);
    };

    const handleActivity = () => {
      if (showLogoutWarning) return;

      setupInactivityTracking();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    setupInactivityTracking();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [user, router]);

  const handleLogout = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    logout();
  };

  const handleStayLogin = () => {
    setShowLogoutWarning(false);
    
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    const event = new MouseEvent('mousemove');
    window.dispatchEvent(event);
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>My Tasks</h1>
            <p className={styles.welcome}>Welcome, {user.firstName}!</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <TodoForm />
          <TodoList />
        </div>
      </main>

      {showLogoutWarning && (
        <LogoutWarning
          countdownSeconds={countdownSeconds}
          onStayLogin={handleStayLogin}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

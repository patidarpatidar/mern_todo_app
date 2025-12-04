import styles from '../styles/LogoutWarning.module.css';

export default function LogoutWarning({
  countdownSeconds,
  onStayLogin,
  onLogout,
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Session Timeout Warning</h2>
        <p className={styles.message}>
          You will be automatically logged out due to inactivity.
        </p>
        <div className={styles.countdown}>
          <p className={styles.countdownText}>
            Time remaining: <span className={styles.timer}>{countdownSeconds}s</span>
          </p>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${(countdownSeconds / 60) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className={styles.buttons}>
          <button onClick={onStayLogin} className={styles.stayBtn}>
            Stay Login
          </button>
          <button onClick={onLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

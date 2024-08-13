import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      // Success handling
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username); // Store username
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <img src="https://assetsio.gnwcdn.com/steam_purple_header_1.jpg?width=1920&height=1920&fit=bounds&quality=80&format=jpg&auto=webp" alt="Steam Banner" style={styles.banner} />
      <div style={styles.titleSection}>
        <h1 style={styles.title}>Steam Game Store</h1>
        <p style={styles.slogan}>Happy Gaming, Happy Life</p>
      </div>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{ textAlign: 'left' }}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              style={styles.input}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit" style={styles.loginButton}>Login</button>
          </div>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <div style={{ marginTop: '20px' }}>
          <p>Not a member yet?</p>
          <button onClick={() => router.push('/register')} style={styles.registerButton}>Register</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("https://steamuserimages-a.akamaihd.net/ugc/1025073109307936615/7B05EA445032A38AA82576A8C924F99EC52D89A0/")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#fff', // Optional: Set text color to white for better contrast
  },
  banner: {
    width: '280px',
    height: 'auto',
    marginBottom: '0px', // Space between the banner and title section
  },
  titleSection: {
    height:'40px',
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '74px',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '0px',
  },
  slogan: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '5px',
  },
  formContainer: {
    paddingTop:'80px',
    textAlign: 'center',
    padding: '80px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    borderRadius: '20px',
    border: '1px solid #ccc',
  },
  loginButton: {
    width: '150px',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
  },
  registerButton: {
    width: '150px',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};

export default Login;

import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Register successful, welcome to Steam Game Store');
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Redirect to login after 2 seconds
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
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
        <h2 style={{ marginBottom: '30px' }}>Registration</h2>
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
            <button type="submit" style={styles.registerButton}>Register</button>
          </div>
        </form>
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <div style={{ marginTop: '20px' }}>
          <p>Already have an account?</p>
          <button onClick={() => router.push('/login')} style={styles.loginButton}>Login</button>
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
    marginBottom: '0px',  // Reduced marginBottom to bring title and registration closer
    marginTop: '0px',     // Adjusted marginTop to position the title section lower
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
    paddingTop: '0px',
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
  success: {
    color: 'green',
    marginTop: '20px',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};

export default Register;

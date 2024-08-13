// components/Header.js
import React from 'react';

const Header = ({ userId, handleLogout }) => {
  return (
    <div style={styles.headerContainer}>
      <div style={styles.userSection}>
        <p>Hi, {userId}</p>
        <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
      </div>
      <div style={styles.titleSection}>
        <h1 style={styles.title}>Steam Game Store</h1>
        <p style={styles.slogan}>Happy Gaming, Happy Life</p>
      </div>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  userSection: {
    color:'black',
    paddingLeft:'450px',
    display: 'flex',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: '10px',
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
  },
  title: {
    paddingRight: '640px',
    fontWeight: 'bold',
    marginBottom:'0px',
  },
  slogan: {
    paddingRight: '640px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '5px',
  },
};

export default Header;

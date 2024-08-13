import React from 'react';

const SearchForm = ({ searchQuery, onSearchQueryChange, onSearch }) => {
  return (
    <form onSubmit={onSearch} style={styles.form}>
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchQueryChange}
        placeholder="Search your game by game name or ID"
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Search
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '10px 15px',
    borderRadius: '20px 0 0 20px',
    border: '1px solid #ccc',
    flexGrow: 1,
    fontSize: '16px',
    outline: 'none',
    width: '300px', // Adjust the width as needed
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '0 20px 20px 0',
    border: '1px solid #ccc',
    borderLeft: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    outline: 'none',
  },
};

export default SearchForm;

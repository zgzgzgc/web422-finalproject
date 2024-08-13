import React from 'react';
import Link from 'next/link';

const GameCard = ({ game }) => {
  return (
    <Link href={`/game/${game.appid}`} passHref>
      <div style={styles.card}>
        {game.coverImage && <img src={game.coverImage} alt={game.name} style={styles.coverImage} />}
        <h3 style={styles.title}>{game.name}</h3>
        <p style={styles.appid}>ID: {game.appid}</p>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '20px',
    margin: '10px',
    width: '500px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  coverImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  title: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  appid: {
    fontSize: '14px',
    color: '#555',
  },
};

export default GameCard;

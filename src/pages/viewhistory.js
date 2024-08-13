import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import HomeButton from '../components/Home';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 3; // Number of items per page

const ViewHistory = () => {
  const [userId, setUserId] = useState('');
  const [viewHistoryGames, setViewHistoryGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
  
    if (!token) {
      router.push('/login');
    } else {
      setUserId(storedUsername);
      fetchViewHistory(storedUsername);
    }
  }, [router]);

  const fetchViewHistory = async (username) => {
    try {
      const response = await fetch(`/api/viewhistory?username=${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve view history');
      }

      const { games } = await response.json();

      const gamesWithDetails = await Promise.all(
        games.map(async (appid) => {
          const gameResponse = await fetch(`https://steam-api7.p.rapidapi.com/name/${appid}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
              'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
            },
          });

          if (!gameResponse.ok) {
            throw new Error(`Failed to fetch details for appid ${appid}`);
          }

          const gameData = await gameResponse.json();
          const coverImage = await fetchCoverImage(appid);
          return { ...gameData, coverImage, appid };
        })
      );

      console.log("Fetched View History Games:", gamesWithDetails);
      setViewHistoryGames(gamesWithDetails);
      setTotalPages(Math.ceil(gamesWithDetails.length / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error fetching view history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoverImage = async (appid) => {
    try {
      const coverResponse = await fetch(
        `https://steam-api7.p.rapidapi.com/media/coverImage/${appid}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
            'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
          },
        }
      );

      const coverImage = await coverResponse.text();

      if (coverImage === 'Cover image not found') {
        return null;
      }

      return coverImage;
    } catch (err) {
      console.error(`Error fetching cover image for game ${appid}:`, err);
      return null;
    }
  };

  const updateCurrentPageGames = (page) => {
    setCurrentPage(page);
  };

  const displayedGames = viewHistoryGames.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div style={styles.container}>
      <Header userId={userId} handleLogout={() => router.push('/login')} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <HomeButton />
        <button
          style={styles.navButton}
          onClick={() => router.push('/wishlist')}  // Redirects to wishlist page
        >
          Wish List
        </button>
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        {displayedGames.length === 0 && !loading && <p>No games in your view history</p>}
        {displayedGames.map((game) => (
          <GameCard key={game.appid} game={game} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={updateCurrentPageGames}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '2000px',
    margin: 'auto',
    backgroundImage: 'url("https://steamuserimages-a.akamaihd.net/ugc/1025073109307936615/7B05EA445032A38AA82576A8C924F99EC52D89A0/")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    color: '#fff', // Optional: Set text color to white for better contrast
  },
  navButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    cursor: 'pointer',
    height: '38px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
};

export default ViewHistory;

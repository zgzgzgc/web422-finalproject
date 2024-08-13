import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchForm from '../components/SearchForm';
import GameCard from '../components/GameCard';
import Pagination from '../components/Pagination';
import HomeButton from '../components/Home';
import Header from '../components/Header';

const Home = () => {
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allGames, setAllGames] = useState([]); // Store all games here
  const [currentGames, setCurrentGames] = useState([]); // Games to display on the current page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const ITEMS_PER_PAGE = 3; // Number of items per page

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
  
    if (!token) {
      router.push('/login');
    } else {
      setUserId(storedUsername); // Use the stored username here
    }
  }, [router]);

  useEffect(() => {
    if (allGames.length > 0) {
      updateCurrentPageGames(1);
      setTotalPages(Math.ceil(allGames.length / ITEMS_PER_PAGE));
    }
  }, [allGames]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const fetchGames = async (query) => {
    setLoading(true);
    setError('');
    setAllGames([]);
  
    const isNumeric = /^\d+$/.test(query);
  
    try {
      let data;
  
      if (isNumeric) {
        // Fetch the game by ID
        const idResponse = await fetch(`https://steam-api7.p.rapidapi.com/name/${query}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
            'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
          },
        });
  
        if (!idResponse.ok) {
          throw new Error('Error fetching data. Please try again.');
        }
  
        data = await idResponse.json();
  
        if (!data || !data.name) {
          setAllGames([{ name: 'No result found', appid: query }]);
          return;
        }
  
        // Now use the game name from the result to search for more details
        const nameQuery = data.name;
        const nameResponse = await fetch(`https://steam-api7.p.rapidapi.com/search?query=${encodeURIComponent(nameQuery)}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
            'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
          },
        });
  
        if (!nameResponse.ok) {
          throw new Error('Error fetching data. Please try again.');
        }
  
        data = await nameResponse.json();
      } else {
        // Fetch the game by name directly
        const nameResponse = await fetch(`https://steam-api7.p.rapidapi.com/search?query=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
            'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
          },
        });
  
        if (!nameResponse.ok) {
          throw new Error('Error fetching data. Please try again.');
        }
  
        data = await nameResponse.json();
      }
  
      if (Array.isArray(data.results)) {
        const gamesWithCovers = await Promise.all(
          data.results.map(fetchCoverImage)
        );
  
        const filteredGames = gamesWithCovers.filter(game => game !== null);
        setAllGames(filteredGames);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchCoverImage = async (game) => {
    try {
      const coverResponse = await fetch(
        `https://steam-api7.p.rapidapi.com/media/coverImage/${game.appid}`,
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
        return null; // Filter out games with no valid cover image
      }

      return { ...game, coverImage };
    } catch (err) {
      console.error(`Error fetching cover image for game ${game.appid}:`, err);
      return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (query) {
      await fetchGames(query);
    }
  };

  const updateCurrentPageGames = (page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setCurrentGames(allGames.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  const handlePageChange = (page) => {
    updateCurrentPageGames(page);
  };

  return (
    <div style={styles.container}>
      <Header userId={userId} handleLogout={handleLogout} />
    
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <HomeButton style={styles.button} /> 
        <button
          onClick={() => router.push('/wishlist')}
          style={styles.button}
        > 
          Wish List
        </button>
        <button
          onClick={() => router.push('/viewhistory')}
          style={styles.button}
        > 
          Viewed History
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <SearchForm
          searchQuery={searchQuery}
          onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        {currentGames.map((game) => (
          <GameCard key={game.appid} game={game} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    color: 'white',
    padding: '20px',
    maxWidth: '10000px',
    margin: 'auto',
    backgroundImage: 'url("https://steamuserimages-a.akamaihd.net/ugc/1025073109307936615/7B05EA445032A38AA82576A8C924F99EC52D89A0/")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '30px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    cursor: 'pointer',
    height:'38px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
};

export default Home;

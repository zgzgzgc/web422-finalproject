import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HomeButton from '../../components/Home';

const GameDetails = () => {
  const router = useRouter();
  const { appid } = router.query;
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [userId, setUserId] = useState('');
  const [isDLC, setIsDLC] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserId(storedUsername);
      if (appid) {
        addToViewHistory(storedUsername, appid);
      }
    }
  }, [appid]);

  const fetchGameDetails = async (appid) => {
    try {
      const response = await fetch(`https://steam-api7.p.rapidapi.com/appDetails/${appid}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
          'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
        },
      });

      if (response.status === 500) {
        setIsDLC(true);
        const originalGameResponse = await fetch(`https://steam-api7.p.rapidapi.com/name/${appid}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'steam-api7.p.rapidapi.com',
            'x-rapidapi-key': '8eed3dbb55msh5fa92a2a429847dp1c670fjsn0278835f153c',
          },
        });
        const originalGameData = await originalGameResponse.json();
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
        
        setGameDetails({
          name: `DLC for ${originalGameData.name}`,
          steam_appid: appid,
          short_description: `This is DLC of the game ${originalGameData.name}, which contains updates and additional content. We hope you enjoy this update!`,
          coverImage: coverImage !== 'Cover image not found' ? coverImage : null,
        });
        return;
      }

      if (!response.ok) {
        throw new Error('Error fetching game details');
      }

      const data = await response.json();
      setGameDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToViewHistory = async (username, appid) => {
    try {
      const response = await fetch('/api/viewhistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appid, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to view history');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleNextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % gameDetails.media.screenshots.length);
  };

  const handlePreviousScreenshot = () => {
    setCurrentScreenshot((prev) =>
      prev === 0
        ? gameDetails.media.screenshots.length - 1
        : prev - 1
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const handleAddToWishList = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appid: gameDetails.steam_appid, username: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to wish list');
      }

      alert('Game added to wish list!');
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (appid) {
      fetchGameDetails(appid);
    }
  }, [appid]);

  if (loading) return <div style={styles.loadingContainer}>Loading...</div>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
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
      
      <div style={styles.navigation}>
        <HomeButton />
        <button style={styles.navButton} onClick={() => router.push('/wishlist')}>Wish List</button>
        <button style={styles.navButton} onClick={() => router.push('/viewhistory')}>Viewed History</button>
      </div>

      {gameDetails ? (
        <>
          <h1 style={styles.gameTitle}>{gameDetails.name}</h1>
          {!isDLC && gameDetails.media && gameDetails.media.screenshots.length > 0 && (
            <div style={styles.screenshotContainer}>
              <button onClick={handlePreviousScreenshot} style={styles.navButton}>{'<'}</button>
              <img
                src={gameDetails.media.screenshots[currentScreenshot]}
                alt={`Screenshot ${currentScreenshot + 1}`}
                style={styles.screenshot}
              />
              <button onClick={handleNextScreenshot} style={styles.navButton}>{'>'}</button>
            </div>
          )}
          {isDLC && gameDetails.coverImage && (
            <div style={styles.coverContainer}>
              <img
                src={gameDetails.coverImage}
                alt={`Cover of ${gameDetails.name}`}
                style={styles.coverImage}
              />
            </div>
          )}
          <div style={styles.detailsContainer}>
            <p><strong>ID:</strong> {gameDetails.steam_appid}</p>
            <p><strong>Description:</strong> {gameDetails.short_description}</p>
            {!isDLC && (
              <>
                <p><strong>Required Age:</strong> {gameDetails.required_age}</p>
                <p><strong>Developers:</strong> {gameDetails.developers}</p>
                <p><strong>Publishers:</strong> {gameDetails.publishers}</p>
                {gameDetails.price_overview && gameDetails.price_overview.final_formatted && (
                  <p><strong>Price:</strong> {gameDetails.price_overview.final_formatted}</p>
                )}
              </>
            )}
            <button onClick={handleAddToWishList} style={styles.addToWishListButton}>Add to Wish List</button>
          </div>
        </>
      ) : (
        <p>No game details found.</p>
      )}
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
    color: '#fff', // Adjusting text color for better readability
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  userSection: {
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
    paddingRight: '220px',
    fontWeight: 'bold',
    marginBottom:'0px',
  },
  slogan: {
    paddingRight: '220px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '5px',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  navButton: {
    height:'38px',
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  addToWishListButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  gameTitle: {
    color:'black',
    textAlign: 'center',
  },
  screenshotContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
  },
  coverContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    marginBottom:'0px',
  },
  coverImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
  },
  detailsContainer: {
    margin: '20px auto',
    maxWidth: '535px',
    padding: '20px',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  screenshot: {
    maxWidth: '100%',
    maxHeight: '300px',
    margin: '0 20px',
    borderRadius: '8px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '20px',
    fontWeight: 'bold',
  },
};

export default GameDetails;

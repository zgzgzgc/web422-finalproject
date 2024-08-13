import React from 'react';
import { useRouter } from 'next/router';

const HomeButton = () => {
  const router = useRouter();

  const navigateToHome = () => {
    router.push('/');
  };

  return (
    <button 
      onClick={navigateToHome} 
      style={{
        padding: '10px 20px',
        borderRadius: '20px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #ccc',
        cursor: 'pointer',
        marginBottom: '20px' // Ensures consistent spacing
      }}
    >
      Home
    </button>
  );
};

export default HomeButton;

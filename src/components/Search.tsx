import React, { useState, useEffect, useRef } from 'react';
import { useSpotifyService } from '../services/SpotifyService';
import { useAuthContext } from '../contexts/AuthContext';
import { Virtuoso } from 'react-virtuoso';


export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [savedContent, setSavedContent] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { isAuthenticated } = useAuthContext();

  const { getSavedContent } = useSpotifyService();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();

    if (searchTermLower === '') {
      setSearchResults(savedContent);
    } else {
      const filteredResults = savedContent.filter((item) => {
        const { name, genre, type } = item;
        return (
          name.toLowerCase().includes(searchTermLower) ||
          genre.toLowerCase().includes(searchTermLower) ||
          type.toLowerCase().includes(searchTermLower)
        );
      });
      setSearchResults(filteredResults);
    }
  };

  const didFetch = useRef(false);

  useEffect(() => {
    const fetchSavedContent = async () => {
      didFetch.current = true;
      try {
        if (isAuthenticated) {
          const allContent = await getSavedContent();

          setSavedContent(allContent);
        }
      } catch (error) {
        console.error('Error fetching saved content:', error);
      }
    };

    if (!didFetch.current) {
      fetchSavedContent();
    }
  }, [getSavedContent, isAuthenticated]);

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>

      <Virtuoso
        style={{ width: '100%', height: '500px' }} // Adjust the width and height as per your requirement
        totalCount={searchResults.length}
        itemContent={(index: number) => {
          const item = searchResults[index];
          return (
            <div>
              <img src={item.artwork} alt={item.name} style={{ maxHeight: '150px' }} />
              {item.name} - {item.type}
            </div>
          );
        }}
      />

    </div>
  );
};

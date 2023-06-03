import React, { useState, useEffect } from 'react';

type SpotifyContent = {
  id: string,
  artwork: string,
  name: string;
  genre: string;
  type: string;
}

export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedContent, setSavedContent] = useState<SpotifyContent[]>([]);
  const [searchResults, setSearchResults] = useState<SpotifyContent[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    const filteredResults = savedContent.filter((item) => {
      const { name, genre, type } = item;
      const searchTermLower = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(searchTermLower) ||
        genre.toLowerCase().includes(searchTermLower) ||
        type.toLowerCase().includes(searchTermLower)
      );
    });
    setSearchResults(filteredResults);
  };

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const [albumsResponse, tracksResponse, episodesResponse] = await Promise.all([
          fetch('https://api.spotify.com/v1/me/albums'),
          fetch('https://api.spotify.com/v1/me/tracks'),
          fetch('https://api.spotify.com/v1/me/episodes')
        ]);

        if (!albumsResponse.ok || !tracksResponse.ok || !episodesResponse.ok) {
          throw new Error('Failed to fetch saved content');
        }

        const [albumsData, tracksData, episodesData] = await Promise.all([
          albumsResponse.json(),
          tracksResponse.json(),
          episodesResponse.json()
        ]);

        const albums = albumsData.items.map((item:any) => ({
          id: item.album.id,
          artwork: item.album.images[0]?.url,
          name: item.album.name,
          genre: item.album.genres.join(', '),
          type: 'Album'
        }));

        const tracks = tracksData.items.map((item:any) => ({
          id: item.track.id,
          artwork: item.track.album.images[0]?.url,
          name: item.track.name,
          genre: item.track.artists.map((artist) => artist.name).join(', '),
          type: 'Track'
        }));

        const episodes = episodesData.items.map((item:any) => ({
          id: item.episode.id,
          artwork: item.episode.images[0]?.url,
          name: item.episode.name,
          genre: item.episode.show.publisher,
          type: 'Episode'
        }));

        const allContent = [...albums, ...tracks, ...episodes];
        setSavedContent(allContent);
      } catch (error) {
        console.error('Error fetching saved content:', error);
      }
    };

    fetchSavedContent();
  }, []);

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
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>
            <img src={result.artwork} alt={result.name} />
            <p>{result.name}</p>
            <p>{result.genre}</p>
            <p>{result.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

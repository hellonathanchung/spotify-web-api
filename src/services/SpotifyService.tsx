
export function useSpotifyService() {
  const accessToken = localStorage.getItem('access_token');

  const headers = {
    Authorization: 'Bearer ' + accessToken,
  };

  const getUserData = () => {
    fetch('https://api.spotify.com/v1/me', {
      headers
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw await response.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  const getSavedContent = async (): Promise<any[]> => {
    const [albumsResponse, tracksResponse, episodesResponse] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/albums', { headers }),
      fetch('https://api.spotify.com/v1/me/tracks', { headers }),
      fetch('https://api.spotify.com/v1/me/episodes', { headers })
    ]);

    if (!albumsResponse.ok || !tracksResponse.ok || !episodesResponse.ok) {
      throw new Error('Failed to fetch saved content');
    }

    const [albumsData, tracksData, episodesData] = await Promise.all([
      albumsResponse.json(),
      tracksResponse.json(),
      episodesResponse.json()
    ]);

    const albums = albumsData.items.map((item: any) => ({
      id: item.album.id,
      artwork: item.album.images[0]?.url,
      name: item.album.name,
      genre: item.album.genres.join(', '),
      type: 'Album'
    }));

    const tracks = tracksData.items.map((item: any) => ({
      id: item.track.id,
      artwork: item.track.album.images[0]?.url,
      name: item.track.name,
      genre: item.track.artists.map((artist: any) => artist.name).join(', '),
      type: 'Track'
    }));

    const episodes = episodesData.items.map((item: any) => ({
      id: item.episode.id,
      artwork: item.episode.images[0]?.url,
      name: item.episode.name,
      genre: item.episode.show.publisher,
      type: 'Episode'
    }));

    return [...albums, ...tracks, ...episodes];
  }

  return {
    getSavedContent,
    getUserData
  }
};

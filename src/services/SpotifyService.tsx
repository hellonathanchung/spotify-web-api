export type UserData = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null | string;
    total: number;
  };
  href: string;
  id: string;
  images: {
    height: null | number;
    url: string;
    width: null | number;
  }[];
  product: string;
  type: string;
  uri: string;
};

export type ContentItem<T> = {
  id: string;
  artwork: string | undefined;
  name: string;
  genre: string;
  type: T;
};

// I saw that there was a typescript wrapper that included all the typings
//https://github.com/spotify-api/spotify-types

// I would have leveraged that but wanted to limit some of the packages being used.
// if this was a much larger project, I would probably try to use that.

export function useSpotifyService() {
  const accessToken = localStorage.getItem("access_token");

  const headers = {
    Authorization: "Bearer " + accessToken,
  };

  const getUserData = (): Promise<UserData | undefined> => {
    const response = fetch("https://api.spotify.com/v1/me", {
      headers,
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw await response.json();
        }
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });

    return response;
  };

  const getSavedContent = async (): Promise<ContentItem<"Album" | "Episode" | "Track">[]> => {
    const [albumsResponse, tracksResponse, episodesResponse] =
      await Promise.all([
        fetch("https://api.spotify.com/v1/me/albums", { headers }),
        fetch("https://api.spotify.com/v1/me/tracks", { headers }),
        fetch("https://api.spotify.com/v1/me/episodes", { headers }),
      ]);

    if (!albumsResponse.ok || !tracksResponse.ok || !episodesResponse.ok) {
      throw new Error("Failed to fetch saved content");
    }

    const [albumsData, tracksData, episodesData] = await Promise.all([
      albumsResponse.json(),
      tracksResponse.json(),
      episodesResponse.json(),
    ]);

    const albums: ContentItem<"Album">[] = albumsData.items.map(
      (item: any) => ({
        id: item.album.id,
        artwork: item.album.images[0]?.url,
        name: item.album.name,
        genre: item.album.genres.join(", "),
        type: "Album",
      })
    );

    const tracks: ContentItem<"Track">[] = tracksData.items.map(
      (item: any) => ({
        id: item.track.id,
        artwork: item.track.album.images[0]?.url,
        name: item.track.name,
        genre: item.track.artists.map((artist: any) => artist.name).join(", "),
        type: "Track",
      })
    );

    const episodes: ContentItem<"Episode">[] = episodesData.items.map(
      (item: any) => ({
        id: item.episode.id,
        artwork: item.episode.images[0]?.url,
        name: item.episode.name,
        genre: item.episode.show.publisher,
        type: "Episode",
      })
    );

    return [...albums, ...tracks, ...episodes];
  };

  return {
    getSavedContent,
    getUserData,
  };
}

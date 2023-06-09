import React, { useState, useEffect, useRef } from "react";
import { ContentItem, useSpotifyService } from "../services/SpotifyService";
import { useAuthContext } from "../contexts/AuthContext";
import { Virtuoso } from "react-virtuoso";
import {
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  debounce,
} from "@mui/material";

export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [savedContent, setSavedContent] = useState<
    ContentItem<"Album" | "Track" | "Episode">[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    ContentItem<"Album" | "Track" | "Episode">[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isAuthenticated } = useAuthContext();
  const { getSavedContent } = useSpotifyService();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const performSearch = debounce(() => {
    const searchTermLower = searchTerm.toLowerCase();

    if (searchTermLower === "") {
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

    setIsLoading(false);
  }, 500);

  const didFetch = useRef(false);
// Ways to expand, also introduce searching catalogs in general for music recommendations and not just saved audio tracks
  useEffect(() => {
    const fetchSavedContent = async () => {
      setIsLoading(true);

      didFetch.current = true;
      try {
        if (isAuthenticated) {
          const allContent = await getSavedContent();
          setSavedContent(allContent);
        }
      } catch (error) {
        console.error("Error fetching saved content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!didFetch.current) {
      fetchSavedContent();
    } else {
      performSearch();
    }
  }, [getSavedContent, isAuthenticated, savedContent, performSearch]);

  return (
    <Container>
      <TextField
        type="text"
        fullWidth
        sx={{ borderRadius: "30px", flex: 1, maxHeight: "60px", mb: 2 }}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search your songs"
      />
      <Stack
        flexDirection="row"
        sx={{
          fontWeight: "bold",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          py: 1,
          px: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ flex: 1 }}></Typography>
        <Typography variant="subtitle1" sx={{ flex: 2 }}>
          Title
        </Typography>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Genre
        </Typography>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Type
        </Typography>
      </Stack>
      {isLoading ? (
          <Stack
            sx={{
              display: "flex",
              flex: 1,
              height: "700px",
              backgroundColor: "rgba(255,255,255,0.01)",
              borderRadius: "20px",
            }}
          >
        <Stack justifyContent={'center'} alignItems={'center'} flex={1}>
            <Typography sx={{fontSize: '18px', fontWeight: 600}}>
              Loading
              </Typography>
            <CircularProgress />
          </Stack>
        </Stack>
      ) : (
        <Virtuoso
          style={{
            display: "flex",
            flex: 1,
            height: "700px",
            backgroundColor: "rgba(255,255,255,0.01)",
            borderRadius: "20px",
          }}
          totalCount={searchResults.length}
          itemContent={(index: number) => {
            const item = searchResults[index];
            return (
              <Stack
                flexDirection={"row"}
                sx={{
                  padding: "15px 15px",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.10)",
                    cursor: "pointer",
                  },
                }}
              >
                <img
                  src={item.artwork}
                  alt={item.name}
                  style={{
                    maxHeight: "150px",
                    maxWidth: "150px",
                    flex: 1,
                    borderRadius: "8px",
                  }}
                />
                <Stack flexDirection="row" ml={2} flex={1}>
                  <Typography sx={{ flex: 2 }}> {item.name}</Typography>
                  <Typography sx={{ flex: 1 }}> {item.genre}</Typography>
                  <Typography sx={{ flex: 1 }}>{item.type}</Typography>
                </Stack>
              </Stack>
            );
          }}
        />
      )}
    </Container>
  );
};

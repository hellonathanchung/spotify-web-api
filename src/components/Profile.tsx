import { useEffect, useState } from "react";
import { UserData, useSpotifyService } from "../services/SpotifyService";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from "@mui/material";

export const Profile = () => {
  const { getUserData } = useSpotifyService();
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    const handleUserData = async () => {
      const response = await getUserData();
      if (response) {
        setUserData(response);
      }
    };

    handleUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          flex: 1,
          maxWidth: "400px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar alt={userData?.display_name} src={userData?.images[0].url} sx={{height: '100px', width: '100px'}} />
          <Typography variant="h6" align="center" gutterBottom>
            {userData?.display_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {userData?.email}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {userData?.followers.total} Followers
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            <Button
              variant="outlined"
              sx={{marginTop: '8px'}}
              href={userData?.external_urls.spotify ?? ""}
              target="_blank"
            >
              Go to Spotify
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

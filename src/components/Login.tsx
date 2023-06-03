import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Container,
} from "@mui/material";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SpotifyIcon } from "../assets/spotify-icn";


export const Login = () => {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/search");
    }
  }, [isAuthenticated, navigate]);

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
          height: '400px',
          maxWidth: "400px",
          borderRadius: '30px',
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent
          sx={{
            height: '100%',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        <SpotifyIcon sx={{height: '100px', width: '100px', mb: 3}}/>
          <Button variant={'contained'}  sx={{width: "100px", color: 'white'}} onClick={login}>Login</Button>
        </CardContent>
      </Card>
    </Container>
  );
};

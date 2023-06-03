import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

export const Header: React.FC = React.memo(() => {
  const { isAuthenticated, logout } = useAuthContext();

  const navigate = useNavigate();

  return (
    <header>
      <Stack
        sx={{ padding: "10px 50px" }}
        flexDirection="row"
        justifyContent="space-between"
        alignItems={'center'}
      >
        {isAuthenticated && (
          <Stack flexDirection={"row"}>
            <Button onClick={() => navigate("profile")}>Profile</Button>
            <Button onClick={() => navigate("search")}>Search</Button>
          </Stack>
        )}
        {isAuthenticated ? (
          <Button variant="contained" onClick={logout}>
            Logout
          </Button>
        ) : null}
      </Stack>
    </header>
  );
});

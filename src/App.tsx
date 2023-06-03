import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { Authentication, Search, Profile, Header, Login, RequireAuth } from "./components";
import { Grid } from "@mui/material";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const themeOptions: ThemeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1db954",
    },
    secondary: {
      main: "#2e8aff",
    },
  },
});
const App: React.FC = () => {
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Grid
            alignItems="center"
            justifyContent="center"
            container
            flexWrap="nowrap"
            sx={{
              p: "30px",
              flex: 1,
            }}
          >
            <Grid
              sx={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <Routes>
                <Route path="/authentication" element={<Authentication />} />
                <Route path="/login" element={<Login />} />
                <Route path="" element={<RequireAuth />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/search" element={<Search />} />
                </Route>
              </Routes>
            </Grid>
          </Grid>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

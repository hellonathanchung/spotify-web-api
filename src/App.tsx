import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { Authentication, Search } from './components';
import { Header } from './components/Header';


const App: React.FC = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/authentication" element={<Authentication/>} />
      <Route path="/search" element={<Search/>} />
    </Routes>
  </BrowserRouter>
  </AuthProvider>
  );
};

export default App;

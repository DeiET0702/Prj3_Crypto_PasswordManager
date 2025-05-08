import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Share from './pages/Share';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import React from 'react';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/share" element={<Share />} />
      </Routes>
    </>
  );
}

export default App;

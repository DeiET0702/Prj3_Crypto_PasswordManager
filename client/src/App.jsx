import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import React, { useEffect } from 'react';

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true


function App() {

  useEffect(() => {
    document.title = "2048";
  }, []); 

  return (
    <UserContextProvider>
      <Header />
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      <Footer />
    </UserContextProvider>
  )
}

export default App
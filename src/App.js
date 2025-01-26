import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import Chat from './pages/Chat';
import Contacts from './pages/Contact';
import OurStory from './pages/OurStory';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/our-story" element={<OurStory />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

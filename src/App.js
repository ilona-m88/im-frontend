import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MoviePage from './MoviePage'; 
import CustomerPage from './CustomerPage';

const App = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [topActors, setTopActors] = useState([]);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getData");
        setTopMovies(response.data);
      } catch (error) {
        console.error("Error fetching top movies:", error);
      }
    };

    const fetchTopActors = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getTopActors");
        setTopActors(response.data);
      } catch (error) {
        console.error("Error fetching top actors:", error);
      }
    };

    fetchTopMovies();
    fetchTopActors();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage topMovies={topMovies} topActors={topActors} />} />
          <Route path="/movies" element={<MoviePage topMovies={topMovies} />} /> 
          <Route path="/customers" element={<CustomerPage />} /> 
          {/* Additional routes can go here */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

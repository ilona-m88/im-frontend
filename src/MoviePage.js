import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import './styles.css';

function MoviePage({ topMovies }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [customerId, setCustomerId] = useState('');
    const [showRentButton, setShowRentButton] = useState(false); // "Rent Movie" button

    const handleSearch = async () => {
        try {
            const response = await Axios.get(`http://localhost:3001/searchMovies?q=${searchQuery}`);
            setFilteredMovies(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleRentMovie = async (movie) => {
        console.log('Rent Movie button clicked');
        if (!selectedMovie || !customerId) {
            return;
        }
        try {
            const response = await Axios.post('http://localhost:3001/rentMovie', {
                movieId: selectedMovie.film_id,
                customerId: customerId,
            });

            if (response.data.success) {
                alert('Movie rented successfully!');
            }
        } catch (error) {
            console.error("Error renting movie:", error);
        }
    };


    const handleSelectMovie = async (movie) => {
        try {
            const response = await Axios.get(`http://localhost:3001/getMovieDetails/${movie.film_id}`);
            const detailedMovie = response.data;

            setSelectedMovie(detailedMovie);
            setShowRentButton(true); // Show the "Rent Movie" button
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };
    return (
        <div className="container">
            <div className="text-center my-4">
                <h1 className="colorful-title">Movie Page</h1>
                <div className="button-container">
                    <Link to="/" className="styled-button">
                        <button>Home</button>
                    </Link>
                    <Link to="/customers" className="styled-button">
                        <button>Customers</button>
                    </Link>
                    <Link to="/report" className="styled-button">
                        <button>Report</button>
                    </Link>
                </div>
            </div>
    
            <div className="d-flex flex-column align-items-center mt-5">
                <div className="search-container"> {/* Create a container for search */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by film name, actor, or genre..."
                        className="form-control form-control-lg mb-3"
                        style={{ width: '80%' }}
                    />
                    <button onClick={handleSearch} className="btn btn-primary btn-lg">
                        Search
                    </button>
                </div>

                {selectedMovie && (
                    <div>
                        <p><strong>Description:</strong> {selectedMovie.description}</p>
                        <p><strong>Rating:</strong> {selectedMovie.rating}</p>
                        {selectedMovie.actors && (
                            <p><strong>Actors:</strong> {selectedMovie.actors.join(', ')}</p>
                        )}
                        <p><strong>Rental Rate:</strong> {selectedMovie.rental_rate}</p>
                        <p><strong>Rented:</strong> {selectedMovie.rental_count} times</p>

                        {/* "Rent Movie" button associated with the selected movie */}
                        {showRentButton && (
                            <button onClick={() => handleRentMovie(selectedMovie)} className="btn btn-success btn-lg mt-3">
                                Rent Movie
                            </button>
                        )}
                    </div>
                )}
            </div>

            <ul>
                {filteredMovies.map((movie) => (
                    <li key={movie.film_id}>
                        <span
                            onClick={() => handleSelectMovie(movie)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {movie.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MoviePage;

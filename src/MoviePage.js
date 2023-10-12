import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

function MoviePage({ topMovies }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [customerId, setCustomerId] = useState('');
    const [showRentButton, setShowRentButton] = useState(false); // State to control the visibility of the "Rent Movie" button

    const handleSearch = async () => {
        try {
            const response = await Axios.get(`http://localhost:3001/searchMovies?q=${searchQuery}`);
            setFilteredMovies(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleRentMovie = async () => {
        if (!selectedMovie || !customerId) {
            // Validation: Ensure a movie and customer are selected
            return;
        }

        try {
            // Send a POST request to rent the selected movie
            const response = await Axios.post('http://localhost:3001/rentMovie', {
                movieId: selectedMovie.film_id,
                customerId: customerId,
            });

            if (response.data.success) {
                // Show a success message or update the UI as needed
                alert('Movie rented successfully!');
            }
        } catch (error) {
            console.error("Error renting movie:", error);
        }
    };

    // Function to handle selecting a movie
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setShowRentButton(true); // Show the "Rent Movie" button when a movie is selected
    };

    return (
        <div className="container">
            <div className="text-center my-4">
                <h1 className="text-dark mb-4">Movie Page</h1>
                <div className="d-flex justify-content-center" style={{ marginBottom: '50px' }}>
                    <Link to="/" className="btn btn-warning mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>
                        Home
                    </Link>
                    <Link to="/customers" className="btn btn-success mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>
                        Customers
                    </Link>
                    <Link to="/report" className="btn btn-info mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>
                        Report
                    </Link>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center mt-5">
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

                <div className="mt-3">
                    <label htmlFor="customerId">Customer ID:</label>
                    <input
                        type="text"
                        id="customerId"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                    />
                </div>

                {/* Render the "Rent Movie" button when a movie is selected */}
                {showRentButton && (
                    <button onClick={handleRentMovie} className="btn btn-success btn-lg mt-3">
                        Rent Movie
                    </button>
                )}
            </div>

            <ul>
                {filteredMovies.map((movie) => (
                    <li key={movie.film_id}>
                        <span
                            // Add an onClick event to select the movie
                            onClick={() => handleSelectMovie(movie)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {movie.title}
                        </span>
                        {selectedMovie === movie && (
                            <div>
                                <p><strong>Description:</strong> {selectedMovie.description}</p>
                                <p><strong>Rented:</strong> {movie.rental_count} times</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MoviePage;

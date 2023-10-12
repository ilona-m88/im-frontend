import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage({ topMovies }) {
  console.log("Frontend topMovies:", topMovies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [topActors, setTopActors] = useState([]);

  const [selectedActor, setSelectedActor] = useState(null);
  const [actorDetails, setActorDetails] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);

  const handleActorClick = async (actor) => {
    console.log("Clicked actor ID:", actor.actor_id);
    if (selectedActor === actor) {
      setSelectedActor(null);
      setActorDetails(null);
      setActorMovies([]);
    } else {
      setSelectedActor(actor);
      try {
        const response = await fetch(`http://localhost:3001/getActorDetails/${actor.actor_id}`);
        const data = await response.json();
        setActorDetails(data);

        const actorMoviesResponse = await fetch(`http://localhost:3001/getActorTopMovies/${actor.actor_id}`);
        const actorMoviesData = await actorMoviesResponse.json();
        setActorMovies(actorMoviesData);
      } catch (error) {
        console.error("Error fetching actor details:", error);
      }
    }
  };

  const handleMovieClick = async (movie) => {
    if (selectedMovie === movie) {
      setSelectedMovie(null);
      setMovieDetails(null);
    } else {
      setSelectedMovie(movie);
      try {
        const response = await fetch(`http://localhost:3001/getMovieDetails/${movie.film_id}`);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
  };

  useEffect(() => {
    const fetchTopActors = async () => {
      try {
        const response = await fetch("http://localhost:3001/getTopActors");
        const data = await response.json();
        setTopActors(data);
      } catch (error) {
        console.error("Error fetching top actors:", error);
      }
    };
    fetchTopActors();
  }, []);

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center flex-column">
      <div className="container text-center">
        <h1 className="text-white mb-4">Home page</h1>
        <div className="d-flex justify-content-center mb-4">
          <Link to="/movies" className="btn btn-lg btn-danger mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>Movies</Link>
          <Link to="/customers" className="btn btn-success mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>Customers</Link>
          <Link to="/reports" className="btn btn-info mx-3" style={{ fontSize: '24px', padding: '15px 50px' }}>Reports</Link>
        </div>
        <h2 className="mb-4 text-white">Top 5 Rented Movies</h2>
        <ul className="list-group">
          {topMovies.map(movie => (
            <li key={movie.title} className="list-group-item" onClick={() => handleMovieClick(movie)}>
              <div className="d-flex justify-content-between">
                <span>{movie.title}</span>
                {selectedMovie === movie && (
                  <div>
                    <p><strong>Description:</strong> {movie.description}</p>
                    <p><strong>Rented:</strong> {movie.rental_count} times</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <h3 className="text-white">Top 5 Actors</h3>
          <ul className="list-group">
            {topActors.map(actor => (
              <React.Fragment key={actor.actor_id}>
                <li className="list-group-item" onClick={() => handleActorClick(actor)}>
                  {actor.first_name} {actor.last_name}
                </li>
                {selectedActor === actor && (
                  <React.Fragment>
                    <div className="mt-4">
                      <h3>Actor Details:</h3>
                      <p><strong>Name:</strong> {selectedActor.first_name} {selectedActor.last_name}</p>
                    </div>
                    {actorMovies.length > 0 && (
                      <div className="mt-4">
                        <h3>Top 5 Rented Movies by {selectedActor.first_name} {selectedActor.last_name}</h3>
                        <ul className="list-group">
                          {actorMovies.map(movie => (
                            <li key={movie.film_id} className="list-group-item">
                              {movie.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Link } from "react-router-dom"

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser || null);
    const [token, setToken] = useState(storedToken || null);
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        // Debug token format
        console.log("Token being used:", token);
        console.log("Token length:", token.length);
        
        // Some APIs expect "Bearer " prefix, others don't - try without prefix
        const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        fetch("https://mymovie-api-cc1cba8fc12b.herokuapp.com/movies", {
            headers: { 
                "Authorization": token, // Try without Bearer prefix
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            // Log response status to debug
            console.log("API response status:", response.status, response.statusText);
            
            if (!response.ok) {
                // If token is expired or invalid, try logging in again
                if (response.status === 401) {
                    console.error("Authentication error: Token may be expired or invalid");
                    setError("Authentication error: Please log in again");
                    return null; // Return null instead of throwing to continue execution
                }
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data) return; // Skip if we got null from previous step
            
            console.log("Movies loaded in main view:", data);
            console.log("Number of movies:", data.length);
            setMovies(data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            setError(error.message);
            setLoading(false);
            setMovies([]);
        });
    }, [token]);

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    
    // Filter movies based on search term
    const filteredMovies = movies.filter(movie => 
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.Director && movie.Director.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (movie.Genre && movie.Genre.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Check if a movie is in user's favorites
    const isFavoriteMovie = (movie) => {
        const movieId = movie._id;
        return user && user.FavoriteMovies && user.FavoriteMovies.includes(movieId);
    };

    // Update user data after adding/removing favorites
    const handleFavoriteChange = () => {
        fetch(`https://mymovie-api-cc1cba8fc12b.herokuapp.com/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(userData => {
            console.log("User data updated in main view:", userData);
            console.log("User favorites:", userData.FavoriteMovies);
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(error => {
            console.error("Error updating user data:", error);
        });
    };

    return (
    <BrowserRouter>
        <NavigationBar user={user} onLogout={handleLogout} />
        <Row className="justify-content-md-center">
            <Routes>
            <Route
                path="/login"
                element={
                user ? (
                    <Navigate to="/" />
                ) : (
                    <Col md={6}>
                    <LoginView
                        onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("token", token);
                        }}
                    />
                    </Col>
                )
                }
            />

            <Route
                path="/signup"
                element={
                user ? (
                    <Navigate to="/" />
                ) : (
                    <Col md={6}>
                    <SignupView />
                    </Col>
                )
                }
            />

            <Route
                path="/movies/:movieTitle"
                element={
                !user ? (
                    <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                    <Col>
                        {loading ? "Loading..." : error ? `Error: ${error}` : "The list is empty!"}
                    </Col>
                ) : (
                    <Col md={8}>
                    <MovieView movies={movies} />
                    </Col>
                )
                }
            />

            <Route
                path="/"
                element={
                !user ? (
                    <Navigate to="/login" replace />
                ) : loading ? (
                    <Col>Loading movies...</Col>
                ) : error ? (
                    <Col>Error: {error}</Col>
                ) : movies.length === 0 ? (
                    <Col>The list is empty!</Col>
                ) : (
                    <>
                    <Col xs={12} className="mb-4">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Search by title, director, or genre"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    
                    {filteredMovies.length === 0 ? (
                      <Col>No movies found</Col>
                    ) : (
                      filteredMovies.map((movie) => (
                        <Col className="mb-4" key={movie._id} md={3}>
                          <MovieCard 
                            user={user} 
                            token={token} 
                            movie={movie} 
                            isFavorite={isFavoriteMovie(movie)}
                            onFavoriteChange={handleFavoriteChange}
                          />
                        </Col>
                      ))
                    )}
                    </>
                )
                }
            />

            <Route
                path="/profile"
                element={
                user ? (
                    <ProfileView
                        user={user}
                        token={token}
                        movies={movies}
                        onLogout={handleLogout}
                        onFavoriteChange={handleFavoriteChange}
                    />
                ) : (
                    <Navigate to="/login" replace />
                )}                
            />

            </Routes>
        </Row>
    </BrowserRouter>
    );
};
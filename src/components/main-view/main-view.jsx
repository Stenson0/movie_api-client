import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

    useEffect(() => {
        if (!token) return;

        fetch("https://mymovie-api-cc1cba8fc12b.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(movies => {
            setMovies(movies)})
        .catch(error => {
            console.error("Error fetching movies:", error);
        });
    }, [token]);

        const handleLogout = () => {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
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
                    <Col>The list is empty!</Col>
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
                ) : movies.length === 0 ? (
                    <Col>The list is empty!</Col>
                ) : (
                    <>
                    {movies.map((movie) => (
                        <Col className="mb-4" key={movie._id} md={3}>
                        <MovieCard movie={movie} />
                        </Col>
                    ))}
                    </>
                )
                }
            />

            <Route
                path="/profile"
                element={
                !user ? (
                    <ProfileView
                        user={user}
                        movie={movie}
                        favorites={favorites}
                        onLogout={handleLogout}
                        onRemove={toggleFavorite}
                        onProfileUpdate={handleProfileUpdate}
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
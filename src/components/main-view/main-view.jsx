import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser? storedUser : null);
    const [token, setToken] = useState(storedToken? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        if (!token) return;

        fetch("https://mymovie-api-cc1cba8fc12b.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(movies => {
            setMovies(movies)})
        }, [token]);

        const onBackClick = () => {
            setSelectedMovie(null);
        }

        const handleMovieClick = (newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
        }
    
        const handleLogout = () => {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
            
        if (!user) {
            return (
                <>
                    <LoginView
                        onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("token", token);
                        }}
                    />
                    or 
                    <SignupView />
                </>
            );
        }

    if (selectedMovie) {
        return (
        <Row className="justify-content-md-center">
            <MovieView
            movie={selectedMovie}
            allMovies={movies}
            onBackClick={() => setSelectedMovie(null)}
            onMovieClick={handleMovieClick}    
            />
        </Row>
        );
    }

    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

    return (
    <BrowserRouter>
        <NavigationBar
            user={user}
            onLogout={handleLogout}
        />
        <Row className="justify-content-md-center">
            <Routes>
                <Route 
                    path="/login"
                    element={
                        <>
                            {user ? (
                                <Navigate to="/"/>
                            ) : (
                                <Col>
                                    <LoginView onLoggedIn={(user) => setUser(user)}/>
                                </Col>                           
                            )}
                        </>
                    }
                />
                <Route 
                    path="/signup"
                    element={
                        <>
                            {user ? (
                                <Navigate to="/"/>
                            ) : (
                                <Col>
                                    <SignupView/>
                                </Col>                           
                            )}
                        </>
                    }
                />
                <Route 
                    path="/movies/:movieId"
                    element={
                        <>
                            {user ? (
                                <Navigate to="/login" replace/>
                            ) : movies.length === 0 ? (
                                <Col>The list is empty!</Col>
                            ) : (
                                <Col> md="8"
                                    <MovieView movies={movies}/>
                                </Col>                           
                            )}
                        </>
                    }
                />
                <Route 
                    path="/"
                    element={
                        <>
                            {user ? (
                                <Navigate to="/login" replace/>
                            ) : movies.length === 0 ?(
                                <Col>The list is empty!</Col>
                            ) : (
                                <>
                                    {movies.map((movie) => (
                                    <Col className="mb-4" key={movie._id} md="3">
                                        <MovieCard movie={movie}/>
                                    </Col>
                                    ))}
                                </>                          
                            )}
                        </>
                    }
                />
            </Routes>
        </Row>
    </BrowserRouter>
    );
};
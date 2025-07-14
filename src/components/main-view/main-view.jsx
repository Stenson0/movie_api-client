import { useState, useEffect } from "react";
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
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <>
      <div>
            {movies.map((movie) => (
                <MovieCard
                key={movie.id}
                movie={movie}
                onMovieClick={(newSelectedMovie) => {
                    setSelectedMovie(newSelectedMovie);
                }}
            />
            ))}
        </div>
        <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
    </>
  );
};
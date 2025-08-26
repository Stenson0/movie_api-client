import PropTypes from "prop-types";
import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const API_URL = "https://mymovie-api-cc1cba8fc12b.herokuapp.com";

export const MovieCard = ({
  movie,
  user,
  token,
  isFavorite,
  onFavoriteChange
}) => {
    const handleAddFavorite = () => {
    console.log("Adding favorite for movie:", movie.Title);
    
    // First, try to get the movie ID by searching
    const getMovieIdAndAdd = async () => {
      try {
        // Search for the movie to get its ID
        const searchResponse = await fetch(`${API_URL}/movies?title=${encodeURIComponent(movie.Title)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (searchResponse.ok) {
          const searchResult = await searchResponse.json();
          console.log("Search result for adding:", searchResult);
          
          // Find the specific movie
          let movieId = null;
          if (Array.isArray(searchResult)) {
            const foundMovie = searchResult.find(m => m.Title === movie.Title);
            if (foundMovie && foundMovie._id) {
              movieId = foundMovie._id;
              console.log("Found movie ID for adding:", movieId);
            }
          }
          
          // Try to add using movie ID if found, otherwise use title
          const identifier = movieId || movie.Title;
          console.log("Using identifier for adding:", identifier);
          
          const addResponse = await fetch(`${API_URL}/users/${user.Username}/movies/${encodeURIComponent(identifier)}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log("Add favorite response status:", addResponse.status);
          if (addResponse.ok) {
            const responseData = await addResponse.json();
            console.log("Add favorite response data:", responseData);
            console.log("FavoriteMovies array after adding:", responseData.FavoriteMovies);
            if (onFavoriteChange) onFavoriteChange();
          } else {
            console.error("Failed to add favorite:", addResponse.status);
          }
        }
      } catch (error) {
        console.error("Error in getMovieIdAndAdd:", error);
      }
    };
    
    getMovieIdAndAdd();
  };

    const handleRemoveFavorite = () => {
    console.log("Removing favorite for movie:", movie.Title);
    
    // First, try to get the movie ID by searching
    const getMovieIdAndRemove = async () => {
      try {
        // Search for the movie to get its ID
        const searchResponse = await fetch(`${API_URL}/movies?title=${encodeURIComponent(movie.Title)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (searchResponse.ok) {
          const searchResult = await searchResponse.json();
          console.log("Search result for removing:", searchResult);
          
          // Find the specific movie
          let movieId = null;
          if (Array.isArray(searchResult)) {
            console.log("Search result movies:", searchResult.map(m => ({ title: m.Title, id: m._id })));
            const foundMovie = searchResult.find(m => m.Title === movie.Title);
            if (foundMovie && foundMovie._id) {
              movieId = foundMovie._id;
              console.log("Found movie ID for removing:", movieId);
            } else {
              console.log("Movie not found in search results");
            }
          }
          
          // Try to remove using movie ID if found, otherwise use title
          const identifier = movieId || movie.Title;
          console.log("Using identifier for removing:", identifier);
          
          // Since the API seems to be adding instead of removing, let's try a different approach
          // Let's try to update the entire favorites array by removing the specific movie
          console.log("API is adding instead of removing. Trying to update entire favorites array...");
          
          // First, get the current user data to see the current favorites
          const userResponse = await fetch(`${API_URL}/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("Current user data:", userData);
            console.log("Current FavoriteMovies:", userData.FavoriteMovies);
            
            // Remove all instances of this movie from the favorites array
            const updatedFavorites = userData.FavoriteMovies.filter(fav => fav !== movie.Title);
            console.log("Updated favorites array:", updatedFavorites);
            
            // Update the user's favorites array
            const updateResponse = await fetch(`${API_URL}/users/${user.Username}`, {
              method: "PUT",
              headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                ...userData,
                FavoriteMovies: updatedFavorites
              })
            });
            
            if (updateResponse.ok) {
              const updatedUserData = await updateResponse.json();
              console.log("Successfully updated favorites:", updatedUserData.FavoriteMovies);
              if (onFavoriteChange) onFavoriteChange();
            } else {
              console.error("Failed to update favorites:", updateResponse.status);
            }
          } else {
            console.error("Failed to get user data:", userResponse.status);
          }
        }
      } catch (error) {
        console.error("Error in getMovieIdAndRemove:", error);
      }
    };
    
    getMovieIdAndRemove();
  };

  // Define the image path correctly
  const imagePath = movie.ImagePath || "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <Card className="movie-card h-100">
      <Link to={`/movies/${movie.Title}`}>
        <Card.Img 
          variant="top" 
          src={imagePath} 
          alt={movie.Title}
          style={{ height: "300px", width: "168px"}}
          onError={(e) => {
            console.log("Image failed to load:", imagePath);
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x450?text=Image+Not+Found";
          }} 
        />
      </Link>
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        {user && token && (
          isFavorite ? (
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemoveFavorite}
              className="mt-2"
            >
              Remove from Favorites
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddFavorite}
              className="mt-2"
            >
              Add to Favorites
            </Button>
          )
        )}
      </Card.Body>
    </Card>
  );
};

// Fix PropTypes to match your actual API response structure
MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    ImagePath: PropTypes.string, // Changed from image to ImagePath
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  user: PropTypes.object,
  token: PropTypes.string,
  isFavorite: PropTypes.bool,
  onFavoriteChange: PropTypes.func,
};
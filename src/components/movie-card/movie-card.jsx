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
    // Use movie title as identifier since there's no _id or id field
    const movieId = movie.Title;
    
    if (!movieId) {
      console.error("No movie title found:", movie);
      return;
    }
    
    // Try different endpoint patterns
    const endpoints = [
      `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movieId)}`,
      `${API_URL}/users/${user.Username}/movies?title=${encodeURIComponent(movieId)}`,
      `${API_URL}/users/${user.Username}/favorites/${encodeURIComponent(movieId)}`,
      `${API_URL}/users/${user.Username}/favorites?title=${encodeURIComponent(movieId)}`
    ];
    
    // Try each endpoint until one works
    const tryEndpoint = async (index) => {
      if (index >= endpoints.length) {
        console.error("All endpoints failed for adding favorite");
        return;
      }
      
      try {
        const response = await fetch(endpoints[index], {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          console.log(`Success with endpoint ${index + 1}:`, endpoints[index]);
          if (onFavoriteChange) onFavoriteChange();
        } else {
          console.log(`Endpoint ${index + 1} failed (${response.status}):`, endpoints[index]);
          // Try next endpoint
          tryEndpoint(index + 1);
        }
      } catch (error) {
        console.log(`Endpoint ${index + 1} error:`, error);
        // Try next endpoint
        tryEndpoint(index + 1);
      }
    };
    
    tryEndpoint(0);
  };

  const handleRemoveFavorite = () => {
    // Use movie title as identifier since there's no _id or id field
    const movieId = movie.Title;
    
    if (!movieId) {
      console.error("No movie title found:", movie);
      return;
    }
    
    // Try different endpoint patterns for deletion
    const deleteEndpoints = [
      `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movieId)}`,
      `${API_URL}/users/${user.Username}/movies?title=${encodeURIComponent(movieId)}`,
      `${API_URL}/users/${user.Username}/favorites/${encodeURIComponent(movieId)}`,
      `${API_URL}/users/${user.Username}/favorites?title=${encodeURIComponent(movieId)}`
    ];
    
    // Try each endpoint until one works
    const tryDeleteEndpoint = async (index) => {
      if (index >= deleteEndpoints.length) {
        console.error("All endpoints failed for removing favorite");
        return;
      }
      
      try {
        const response = await fetch(deleteEndpoints[index], {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          console.log(`Success with delete endpoint ${index + 1}:`, deleteEndpoints[index]);
          if (onFavoriteChange) onFavoriteChange();
        } else {
          console.log(`Delete endpoint ${index + 1} failed (${response.status}):`, deleteEndpoints[index]);
          // Try next endpoint
          tryDeleteEndpoint(index + 1);
        }
      } catch (error) {
        console.log(`Delete endpoint ${index + 1} error:`, error);
        // Try next endpoint
        tryDeleteEndpoint(index + 1);
      }
    };
    
    tryDeleteEndpoint(0);
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
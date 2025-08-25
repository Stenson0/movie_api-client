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
    // Use either _id or id, whichever is available
    const movieId = movie._id || movie.id;
    
    if (!movieId) {
      console.error("No movie ID found:", movie);
      return;
    }
    
    fetch(`${API_URL}/users/${user.Username}/movies/${movieId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to add favorite (${res.status})`);
        // Some endpoints return 204 No Content; safely consume if present
        try { await res.json(); } catch (_) {}
        if (onFavoriteChange) onFavoriteChange();
      })
      .catch(err => console.error("Add favorite error:", err));
  };

  const handleRemoveFavorite = () => {
    // Use either _id or id, whichever is available
    const movieId = movie._id || movie.id;
    
    if (!movieId) {
      console.error("No movie ID found:", movie);
      return;
    }
    
    fetch(`${API_URL}/users/${user.Username}/movies/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to remove favorite (${res.status})`);
        try { await res.json(); } catch (_) {}
        if (onFavoriteChange) onFavoriteChange();
      })
      .catch(err => console.error("Remove favorite error:", err));
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
    _id: PropTypes.string,
    id: PropTypes.string,
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
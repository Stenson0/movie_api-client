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
    fetch(`${API_URL}/users/${user.Username}/movies/${movie._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        if (onFavoriteChange) onFavoriteChange();
      });
  };

  const handleRemoveFavorite = () => {
    fetch(`${API_URL}/users/${user.Username}/${movie._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        if (onFavoriteChange) onFavoriteChange();
      });
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
        //   style={{ height: "300px", objectFit: "cover" }}
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
    _id: PropTypes.string.isRequired,
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
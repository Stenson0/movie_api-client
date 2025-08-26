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
    console.log("User:", user.Username);
    console.log("Token:", token);
    
    // Use PATCH method with movie title in URL path (this was the working approach)
    fetch(`${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        console.log("Add favorite response status:", res.status);
        if (!res.ok) throw new Error(`Failed to add favorite (${res.status})`);
        // Some endpoints return 204 No Content; safely consume if present
        try { 
          const responseData = await res.json();
          console.log("Add favorite response data:", responseData);
          console.log("FavoriteMovies array after adding:", responseData.FavoriteMovies);
        } catch (_) {}
        console.log("Calling onFavoriteChange callback");
        if (onFavoriteChange) onFavoriteChange();
      })
      .catch(err => {
        console.error("Add favorite error:", err);
        console.error("Error details:", err.message);
      });
  };

  const handleRemoveFavorite = () => {
    console.log("Removing favorite for movie:", movie.Title);
    console.log("User:", user.Username);
    console.log("Token:", token);
    
    // Try different approaches for removing favorites
    const removeApproaches = [
      // Approach 1: PATCH with action: "remove"
      {
        url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "remove" })
      },
      // Approach 2: PATCH with movie title in body
      {
        url: `${API_URL}/users/${user.Username}/movies`,
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ movieTitle: movie.Title, action: "remove" })
      },
      // Approach 3: DELETE with movie title
      {
        url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    ];
    
    // Try each approach until one works
    const tryRemoveApproach = async (index) => {
      if (index >= removeApproaches.length) {
        console.error("All remove approaches failed");
        return;
      }
      
      try {
        const approach = removeApproaches[index];
        console.log(`Trying remove approach ${index + 1}:`, approach);
        
        const response = await fetch(approach.url, {
          method: approach.method,
          headers: approach.headers,
          body: approach.body
        });
        
        console.log(`Remove approach ${index + 1} response status:`, response.status);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log(`Success with remove approach ${index + 1}:`, approach.url);
          console.log("Updated FavoriteMovies array:", responseData.FavoriteMovies);
          if (onFavoriteChange) onFavoriteChange();
        } else {
          console.log(`Remove approach ${index + 1} failed (${response.status}):`, approach.url);
          // Try next approach
          tryRemoveApproach(index + 1);
        }
      } catch (error) {
        console.log(`Remove approach ${index + 1} error:`, error);
        // Try next approach
        tryRemoveApproach(index + 1);
      }
    };
    
        tryRemoveApproach(0);
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
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
    // Use PATCH method with movie title in URL path (this was the working approach)
    fetch(`${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`, {
      method: "PATCH",
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
    // Try different approaches for removing favorites
    const removeApproaches = [
      // Approach 1: DELETE with movie title in URL path
      {
        url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      },
      // Approach 2: DELETE with movie title as query parameter
      {
        url: `${API_URL}/users/${user.Username}/movies?title=${encodeURIComponent(movie.Title)}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      },
      // Approach 3: DELETE from favorites endpoint
      {
        url: `${API_URL}/users/${user.Username}/favorites/${encodeURIComponent(movie.Title)}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      },
      // Approach 4: DELETE from favorites endpoint with query parameter
      {
        url: `${API_URL}/users/${user.Username}/favorites?title=${encodeURIComponent(movie.Title)}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      },
      // Approach 5: PATCH to remove (some APIs use PATCH for both add/remove)
      {
        url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "remove" })
      }
    ];
    
    // Try each approach until one works
    const tryRemoveApproach = async (index) => {
      if (index >= removeApproaches.length) {
        console.error("All approaches failed for removing favorite");
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
        
        if (response.ok) {
          console.log(`Success with remove approach ${index + 1}:`, approach.url);
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
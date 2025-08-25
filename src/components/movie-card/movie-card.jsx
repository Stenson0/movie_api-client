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
    console.log("Full movie object:", movie);
    console.log("Available properties:", Object.keys(movie));
    
    // First, let's try to get a proper movie ID by searching for the movie
    const searchForMovie = async () => {
      try {
        // Try to get movie details by title
        const searchResponse = await fetch(`${API_URL}/movies?title=${encodeURIComponent(movie.Title)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (searchResponse.ok) {
          const searchResult = await searchResponse.json();
          console.log("Search result:", searchResult);
          
          // Handle array result - find the specific movie
          if (Array.isArray(searchResult)) {
            const foundMovie = searchResult.find(m => m.Title === movie.Title);
            if (foundMovie && foundMovie._id) {
              console.log("Found movie with ID:", foundMovie._id);
              addFavoriteWithId(foundMovie._id);
              return;
            }
          } else if (searchResult && searchResult._id) {
            // Handle single object result
            console.log("Found movie with ID:", searchResult._id);
            addFavoriteWithId(searchResult._id);
            return;
          }
        }
        
        // If search didn't work, try the original approaches
        tryOriginalApproaches();
        
      } catch (error) {
        console.log("Search failed, trying original approaches");
        tryOriginalApproaches();
      }
    };
    
    const addFavoriteWithId = async (movieId) => {
      try {
        const response = await fetch(`${API_URL}/users/${user.Username}/movies/${movieId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          console.log("Successfully added favorite with ID:", movieId);
          if (onFavoriteChange) onFavoriteChange();
        } else {
          console.log("Failed to add favorite with ID:", response.status);
          tryOriginalApproaches();
        }
      } catch (error) {
        console.log("Error adding favorite with ID:", error);
        tryOriginalApproaches();
      }
    };
    
         const tryOriginalApproaches = () => {
       // Try different approaches
       const approaches = [
         // Approach 1: Send movie title in request body
         {
           url: `${API_URL}/users/${user.Username}/movies`,
           method: "POST",
           headers: { 
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify({ movieTitle: movie.Title })
         },
         // Approach 2: Send movie title in request body with different field name
         {
           url: `${API_URL}/users/${user.Username}/movies`,
           method: "POST",
           headers: { 
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify({ title: movie.Title })
         },
         // Approach 3: Send movie title in request body with different field name
         {
           url: `${API_URL}/users/${user.Username}/movies`,
           method: "POST",
           headers: { 
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify({ movie: movie.Title })
         },
         // Approach 4: Try with movie title in URL path
         {
           url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
           method: "POST",
           headers: { Authorization: `Bearer ${token}` }
         },
         // Approach 5: Try with movie title as query parameter
         {
           url: `${API_URL}/users/${user.Username}/movies?title=${encodeURIComponent(movie.Title)}`,
           method: "POST",
           headers: { Authorization: `Bearer ${token}` }
         },
         // Approach 6: Try different endpoint structure
         {
           url: `${API_URL}/users/${user.Username}/favorites`,
           method: "POST",
           headers: { 
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify({ movieTitle: movie.Title })
         },
         // Approach 7: Try with PATCH method
         {
           url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
           method: "PATCH",
           headers: { Authorization: `Bearer ${token}` }
         },
         // Approach 8: Try with PUT method
         {
           url: `${API_URL}/users/${user.Username}/movies/${encodeURIComponent(movie.Title)}`,
           method: "PUT",
           headers: { Authorization: `Bearer ${token}` }
         }
       ];
      
      // Try each approach until one works
      const tryApproach = async (index) => {
        if (index >= approaches.length) {
          console.error("All approaches failed for adding favorite");
          return;
        }
        
        try {
          const approach = approaches[index];
          console.log(`Trying approach ${index + 1}:`, approach);
          
          const response = await fetch(approach.url, {
            method: approach.method,
            headers: approach.headers,
            body: approach.body
          });
          
          if (response.ok) {
            console.log(`Success with approach ${index + 1}:`, approach.url);
            if (onFavoriteChange) onFavoriteChange();
          } else {
            console.log(`Approach ${index + 1} failed (${response.status}):`, approach.url);
            // Try next approach
            tryApproach(index + 1);
          }
        } catch (error) {
          console.log(`Approach ${index + 1} error:`, error);
          // Try next approach
          tryApproach(index + 1);
        }
      };
      
      tryApproach(0);
    };
    
    searchForMovie();
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
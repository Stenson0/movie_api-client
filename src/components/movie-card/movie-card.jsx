import PropTypes from "prop-types";
import React, {useState, useEffect } from "react";

import Card from "react-bootstrap/Card";

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
      <Card className="movie-card" onClick={() => onMovieClick(movie)}>
        <Card.Img variant="top" src={movie.image}/>
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
        </Card.Body>
      </Card>
    );
  };

MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,

        image: PropTypes.shape({
                imageUrl: PropTypes.string.isRequired,
        }).isRequired,

        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
};
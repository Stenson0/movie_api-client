import PropTypes from "prop-types";
import React, {useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
    return (
        <Card className="movie-card">
                <Card.Img variant="top" src={movie.image}/>
                <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Link to={`/movies/${movie._id}`}>
                    <MovieCard movie={movie} />
                </Link>
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
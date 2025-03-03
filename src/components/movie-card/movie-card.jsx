import PropTypes from "prop-types";
import React, {useState, useEffect } from "react";

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
      <div
      onClick={() => {
        onMovieClick(movie);
      }}
      >
        {movie.Title}
      </div>
    );
  };

MovieCard.propTypes = {
 movie: PropTypes.shape({
   title: PropTypes.string.isRequired,
 }).isRequired,
 onMovieClick: PropTypes.func.isRequired,
};
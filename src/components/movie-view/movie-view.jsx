import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./movie-view.scss";

export const MovieView = ({ movies }) => {
    const { movieTitle } = useParams();

    const movie = movies.find(
        (m) =>
        m.Title.toLowerCase() === decodeURIComponent(movieTitle).toLowerCase()
    );

    if (!movie) {
        return <div>Movie not found</div>;
    }

    return (
        <div>
            <div>
                <span>Title:</span>
                <span>{movie.Title}</span>
            </div>

            <div>
                <span>Description:</span>
                <span>{movie.Description}</span>
            </div>
            
            <div>
                <span>Director:</span>
                <span>{movie.Director.Name}</span>
            </div>

            <div>
                <span>Genre:</span>
                <span>{movie.Genre.Name}</span>
            </div>

            <Link to="/">
                <button className="back-button" style={{ cursor: "pointer" }}>
                Back
                </button>
            </Link>
        </div>
    );
};

MovieView.propTypes = {
    movies: PropTypes.array.isRequired,
};
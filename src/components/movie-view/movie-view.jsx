import React, {useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./movie-view.scss";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Figure from "react-bootstrap/Figure";

import {MovieCard} from "../movie-card/movie-card";

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>

            <div>
                <img src={movie.image}/>
            </div>

            <div>
                <span>Title:</span>
                <span>{movie.title}</span>
            </div>

            <div>
                <span>Director:</span>
                <span>{movie.Director}</span>
            </div>

            <button
                onClick={onBackClick}
                className="back-button"
                style={{cursor: "pointer"}}
            >
                Back
            </button>
        </div>
    )
}        
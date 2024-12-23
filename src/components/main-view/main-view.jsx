import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "The Shawshank Redemption",
      description: "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
      imageUrl: "https://imgs.search.brave.com/5GMgh9Oyn23ZDmwHX_XyRvAXxLjdq3H9zvHV7gqLazc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly92aWNl/LXByZXNzLmNvbS9j/ZG4vc2hvcC9maWxl/cy9zaGF3c2hhbmst/cmVkZW1wdGlvbi1m/aWxtLXZhdWx0LXBv/c3Rlci1tYXR0LWZl/cmd1c29uLWZsb3Jl/eS5qcGc_dj0xNjg3/MzQ2OTE2JndpZHRo/PTExMDA",
      genre: "Drama",
      director: {
        name: "Frank Darabont",
        bio: "Frank Darabont is a Hungarian-American director, producer, and screenwriter. ",
        birthYear: 1959,
        deathYear: null,
      },
    },
    {
      id: 2,
      title: "The Godfather",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      imageUrl: "https://www.bestmovieposters.co.uk/wp-content/uploads/2019/01/yahyf02i.jpeg",
      genre: "Crime",
      director: {
        name: "Francis Ford Coppola",
        bio: "Francis Ford Coppola is a renowned American filmmaker, born on April 7, 1939, in Detroit, Michigan.",
        birthYear: 1939,
        deathYear: null,
      },
    },
    {
      id: 3,
      title: "Forrest Gump",
      description: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
      imageUrl: "https://cdn2.penguin.com.au/covers/original/9780552996099.jpg",
      genre: "Drama",
      director: {
        name: "Robert Zemeckis",
        bio: "Robert Lee Zemeckis is an American filmmaker known for directing and producing a range of successful and influential movies.",
        birthYear: 1952,
        deathYear: null,
      },
    },
  ]);
  
  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
        key={movie.id}
        movie={movie}
        onMovieClick={(newSelectedMovie) => {
          setSelectedMovie(newSelectedMovie);
        }}
        />
      ))}
    </div>
  );
};
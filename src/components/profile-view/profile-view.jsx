import { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

const API_URL = "https://mymovie-api-cc1cba8fc12b.herokuapp.com";

export const ProfileView = ({ user, token, onLogout, movies }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [form, setForm] = useState({
        Username: "",
        Password: "",
        Email: "",
        Birthday: ""
    });

    useEffect(() => {
        fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(users => {
            const found = users.find(u => u.Username === user.Username);
            setUserInfo(found);
            setForm({
            Username: found.Username,
            Password: "",
            Email: found.Email,
            Birthday: found.Birthday ? found.Birthday.slice(0, 10) : ""
            });
        });
    }, [user, token]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = e => {
        e.preventDefault();
        fetch(`${API_URL}/users/${userInfo.Username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            alert("Profile updated!");
            setUserInfo(data);
        });
    };

    const handleDeregister = () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;
        fetch(`${API_URL}/users/${userInfo.Username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
        alert("Account deleted.");
        onLogout();
        });
    };

    const handleRemoveFavorite = (movieId) => {
        fetch(`${API_URL}/users/${userInfo.Username}/movies/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            alert("Removed from favorites");
            setUserInfo(data);
        });
    };

    if (!userInfo) return <div>Loading...</div>;

    const favoriteMovies = movies.filter(m =>
        userInfo.FavoriteMovies && userInfo.FavoriteMovies.includes(m._id)
    );

    return (
        <Card>
        <Card.Body>
            <Card.Title>Profile</Card.Title>
            <Form onSubmit={handleUpdate}>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                name="Username"
                value={form.Username}
                onChange={handleChange}
                required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                name="Password"
                type="password"
                value={form.Password}
                onChange={handleChange}
                required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                name="Email"
                type="email"
                value={form.Email}
                onChange={handleChange}
                required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                name="Birthday"
                type="date"
                value={form.Birthday}
                onChange={handleChange}
                />
            </Form.Group>
            <Button type="submit" className="mt-2">Update</Button>
            </Form>
            <Button variant="danger" className="mt-3" onClick={handleDeregister}>
            Deregister
            </Button>
            <hr />
            <h5 className="mt-4">Favorite Movies</h5>
            <Row>
            {favoriteMovies.length === 0 && <Col>No favorites yet.</Col>}
            {favoriteMovies.map(movie => (
                <Col key={movie._id} xs={12} md={6} lg={4} className="mb-3">
                <MovieCard
                    movie={movie}
                    onMovieClick={() => {}}
                />
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleRemoveFavorite(movie._id)}
                >
                    Remove from Favorites
                </Button>
                </Col>
            ))}
            </Row>
        </Card.Body>
        </Card>
    );
};


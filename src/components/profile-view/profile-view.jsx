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
        fetch(`${API_URL}/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(userData => {
            setUserInfo(userData);
            setForm({
                Username: userData.Username,
                Password: "",
                Email: userData.Email,
                Birthday: userData.Birthday ? userData.Birthday.slice(0, 10) : ""
            });
        })
        .catch(err => {
            console.error("Error fetching user data:", err);
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
        })
        .catch(err => {
            console.error("Error updating user data:", err);
        });
    };

    const handleDeregister = () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;
        
        fetch(`${API_URL}/users/${userInfo.Username}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Account deleted successfully");
            onLogout();
        })
        .catch(err => {
            console.error("Error deleting account:", err);
        });
    };

    // Get favorite movies
    const favoriteMovies = movies.filter(movie => {
        const movieId = movie._id || movie.id;
        return userInfo && userInfo.FavoriteMovies && userInfo.FavoriteMovies.includes(movieId);
    });

    // Show loading state while fetching user data
    if (!userInfo) return <div>Loading user information...</div>;

    return (
        <Row>
            <Col md={4}>
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>Your Profile</Card.Title>
                        <Form onSubmit={handleUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    name="Username"
                                    value={form.Username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    name="Password"
                                    type="password"
                                    value={form.Password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="Email"
                                    type="email"
                                    value={form.Email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Birthday</Form.Label>
                                <Form.Control
                                    name="Birthday"
                                    type="date"
                                    value={form.Birthday}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Button type="submit" className="mb-3 w-100">Update Profile</Button>
                            <Button variant="danger" onClick={handleDeregister} className="w-100">
                                Delete Account
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={8}>
                <Card>
                    <Card.Body>
                        <Card.Title>Your Favorite Movies</Card.Title>
                        <Row>
                            {favoriteMovies.length === 0 ? (
                                <Col>You haven't added any movies to your favorites yet.</Col>
                            ) : (
                                favoriteMovies.map(movie => (
                                    <Col md={4} key={movie._id || movie.id} className="mb-3">
                                        <MovieCard
                                            movie={movie}
                                            user={user}
                                            token={token}
                                            isFavorite={true}
                                            onFavoriteChange={() => {
                                                // Refresh user data to get updated favorites
                                                fetch(`${API_URL}/users/${user.Username}`, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                })
                                                .then(res => res.json())
                                                .then(userData => {
                                                    setUserInfo(userData);
                                                });
                                            }}
                                        />
                                    </Col>
                                ))
                            )}
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};


import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { debounce } from "lodash";
import "./App.css";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  const debouncedSearch = debounce(async (query) => {
    if (!query || !accessToken) return;

    const searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=5`,
        searchParams
      );
      const data = await response.json();
      if (data.artists && data.artists.items) {
        setSuggestions(data.artists.items);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    if (searchInput) {
      debouncedSearch(searchInput);
    } else {
      setSuggestions([]);
    }
    return () => debouncedSearch.cancel();
  }, [searchInput, accessToken]);

  async function search() {
    setSuggestions([]);
    const artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      artistParams
    )
      .then((result) => result.json())
      .then((data) => data.artists.items[0]?.id);

    if (!artistID) return;

    await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      artistParams
    )
      .then((result) => result.json())
      .then((data) => setAlbums(data.items));
  }

  const selectArtist = (artist) => {
    setSearchInput(artist.name);
    search();
  };

  return (
    <div className="app-container">
      <Container>
        <header className="text-center mb-4">
          <h1 className="title">
            <i className="bi bi-spotify logo"></i> Spotify Album Finder
          </h1>
        </header>

        <div className="search-container">
          <InputGroup className="search-bar">
            <FormControl
              placeholder="Search For Artist"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <Button className="search-button" onClick={search}>
              Search
            </Button>
          </InputGroup>

          {suggestions.length > 0 && (
            <div className="suggestion-container">
              {suggestions.map((artist) => (
                <div
                  key={artist.id}
                  className="suggestion-card"
                  onClick={() => selectArtist(artist)}
                >
                  {artist.images?.[0]?.url ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="suggestion-image"
                    />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  <p>{artist.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Row className="album-grid">
          {albums.map((album) => (
            <Col xs={12} sm={6} md={4} lg={3} key={album.id}>
              <Card className="album-card">
                <Card.Img variant="top" src={album.images[0]?.url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                  <Card.Text>Release Date: {album.release_date}</Card.Text>
                  <Button
                    href={album.external_urls.spotify}
                    target="_blank"
                    className="album-button"
                  >
                    Listen on Spotify
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;

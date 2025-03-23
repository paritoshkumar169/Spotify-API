import React, { useState, useEffect, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import { debounce } from "lodash";
import SearchBar from "./components/SearchBar";
import AlbumCard from "./components/AlbumCard";
import ColorExtractor from "./components/ColorExtractor";
import "./App.css";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [albums, setAlbums] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const authParams = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((res) => res.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((err) => console.error("Error getting token", err));
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query || !accessToken) return;
      fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=artist&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.artists && data.artists.items) {
            setSuggestions(data.artists.items);
          }
        })
        .catch((err) => {
          console.error("Error fetching suggestions", err);
          setSuggestions([]);
        });
    }, 300),
    [accessToken]
  );

  useEffect(() => {
    if (searchInput) {
      debouncedSearch(searchInput);
    } else {
      setSuggestions([]);
    }
    return () => debouncedSearch.cancel();
  }, [searchInput, debouncedSearch]);

  const handleSearch = () => {
    if (!searchInput || !accessToken) return;
    setSuggestions([]); // Clear suggestions when searching

    fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchInput
      )}&type=artist&limit=1`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const artistId = data.artists?.items[0]?.id;
        if (!artistId) return;
        return fetch(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items) {
          setAlbums(data.items);
        }
      })
      .catch((err) => console.error("Error fetching albums", err));
  };

  return (
    <Container className="app-container">
      <div className="header-container">
        <h1 className="app-header">Spotify Album Finder</h1>
        <div className="search-container">
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            onSelectSuggestion={(artist) => {
              setSearchInput(artist.name);
              setSuggestions([]); // Hide dropdown when an artist is selected
              handleSearch();
            }}
            onSearch={handleSearch}
          />
        </div>
      </div>
      {selectedAlbum && (
        <div className="album-details">
          <AlbumCard album={selectedAlbum} />
          <ColorExtractor imageUrl={selectedAlbum.images[0]?.url} />
        </div>
      )}
      <Row className="album-grid">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onClick={() => setSelectedAlbum(album)} // Select album for color extraction
          />
        ))}
      </Row>
    </Container>
  );
}

export default App;

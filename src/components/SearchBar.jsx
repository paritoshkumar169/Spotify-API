import React, { useState, useEffect } from 'react';
import { FormControl, InputGroup, Button } from "react-bootstrap";
import { debounce } from 'lodash';

function SearchBar({ onSearch, accessToken }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearch = debounce(async (query) => {
    if (!query || !accessToken) return setSuggestions([]);

    const searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
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
  }, [searchInput, accessToken, debouncedSearch]);

  const handleSearch = async () => {
    if (suggestions.length > 0) {
      onSearch(suggestions[0].id);
      setSuggestions([]);
    }
  };

  const handleDirectSearch = async () => {
    if (searchInput.trim() === "") return;
    
    const searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=artist&limit=1`,
        searchParams
      );
      const data = await response.json();
      if (data.artists && data.artists.items && data.artists.items.length > 0) {
        onSearch(data.artists.items[0].id);
      }
    } catch (error) {
      console.error("Error searching artist:", error);
    }
  };

  return (
    <div className="search-container">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search For Artist"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              suggestions.length > 0 ? handleSearch() : handleDirectSearch();
            }
          }}
          style={{
            height: "45px",
            borderRadius: "5px 0 0 5px",
            fontSize: "16px",
            paddingLeft: "15px",
          }}
        />
        <Button 
          onClick={() => suggestions.length > 0 ? handleSearch() : handleDirectSearch()}
          style={{
            backgroundColor: "#1DB954",
            borderColor: "#1DB954",
            fontWeight: "bold",
          }}
        >
          Search
        </Button>
      </InputGroup>
      
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((artist) => (
            <li
              key={artist.id}
              onClick={() => {
                setSearchInput(artist.name);
                onSearch(artist.id);
                setSuggestions([]);
              }}
            >
              {artist.images && artist.images.length > 0 ? (
                <img 
                  src={artist.images[artist.images.length-1].url} 
                  alt={artist.name} 
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginRight: "10px"
                  }}
                />
              ) : (
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#ddd",
                  marginRight: "10px"
                }}></div>
              )}
              <span>{artist.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

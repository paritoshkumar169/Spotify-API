import React from "react";
import "./AlbumCard.css";

const AlbumCard = ({ album }) => {
  const defaultImage = "https://via.placeholder.com/300"; // Fallback image

  return (
    <div className="album-card">
      <img
        src={album.images?.[0]?.url || defaultImage}
        alt={album.name}
        className="album-image"
      />
      <div className="album-info">
        <h3>{album.name}</h3>
        <p>Released: {new Date(album.release_date).toLocaleDateString()}</p>
        <a
          href={album.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-button"
        >
          Listen on Spotify
        </a>
      </div>
    </div>
  );
};

export default AlbumCard;

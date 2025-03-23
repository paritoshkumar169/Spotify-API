import React from 'react';
import { Card, Button, Col } from "react-bootstrap";
import { getAverageColor } from '../utils/colorExtractor';

function AlbumCard({ album, setBackgroundColor }) {
  const handleMouseEnter = async () => {
    if (album.images && album.images.length > 0) {
      const averageColor = await getAverageColor(album.images[0].url);
      setBackgroundColor(averageColor);
    }
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card
        onMouseEnter={handleMouseEnter}
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          height: "100%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        className="album-card"
      >
        <div style={{ position: "relative", paddingBottom: "100%" }}>
          <Card.Img
            variant="top"
            src={album.images[0].url}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <Card.Body style={{ padding: "15px" }}>
          <Card.Title 
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {album.name}
          </Card.Title>
          <Card.Text style={{ fontSize: "14px", color: "#666" }}>
            Released: {new Date(album.release_date).toLocaleDateString()}
          </Card.Text>
          <Card.Text style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
            {album.total_tracks} tracks
          </Card.Text>
          <Button
            href={album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#1DB954",
              borderColor: "#1DB954",
              borderRadius: "50px",
              padding: "8px 20px",
              fontWeight: "600",
              fontSize: "14px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <i className="bi bi-spotify"></i> Listen on Spotify
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default AlbumCard;

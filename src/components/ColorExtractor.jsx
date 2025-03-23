import React, { useEffect, useState } from "react";
import ColorThief from "color-thief-browser";
import "./ColorExtractor.css";

const ColorExtractor = ({ imageUrl }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Enable CORS for image processing
    img.src = imageUrl;
    img.onload = () => {
      const colorThief = new ColorThief();
      try {
        const palette = colorThief.getPalette(img, 6); // Extracts 6 dominant colors
        setColors(palette);
      } catch (error) {
        console.error("Error extracting colors:", error);
      }
    };
  }, [imageUrl]);

  return (
    <div className="color-extractor">
      <h4>Extracted Colors:</h4>
      <div className="color-palette">
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              width: "40px",
              height: "40px",
              margin: "5px",
              borderRadius: "5px",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ColorExtractor;

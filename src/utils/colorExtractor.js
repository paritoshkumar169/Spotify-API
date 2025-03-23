export const getAverageColor = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        
        // Sample pixels at intervals to improve performance
        const sampleSize = Math.max(1, Math.floor(data.length / 4 / 10000));
        let count = 0;
        
        for (let i = 0; i < data.length; i += 4 * sampleSize) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Adjust brightness and saturation for better UI
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // If color is too dark, lighten it
        if (brightness < 128) {
          const factor = 1.5;
          r = Math.min(255, Math.floor(r * factor));
          g = Math.min(255, Math.floor(g * factor));
          b = Math.min(255, Math.floor(b * factor));
        }
        
        // If color is too light, add some saturation
        if (brightness > 200) {
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max - min < 30) {  // If it's too gray
            if (max === r) { r = Math.min(255, r + 30); }
            if (max === g) { g = Math.min(255, g + 30); }
            if (max === b) { b = Math.min(255, b + 30); }
          }
        }
        
        resolve(`rgb(${r},${g},${b})`);
      };
      
      img.onerror = () => {
        // Default color if image fails to load
        resolve("rgb(25, 20, 20)");
      };
    });
  };
  
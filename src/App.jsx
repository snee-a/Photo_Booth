import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const filters = {
  none: "",
  grayscale: "grayscale(100%)",
  sepia: "sepia(80%)",
  brightness: "brightness(120%)",
  contrast: "contrast(150%)",
};

function App() {
  const webcamRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [stripPhotos, setStripPhotos] = useState([]);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setStripPhotos((prev) => [...prev, { src: imageSrc, filter: selectedFilter }].slice(-4));
    }
  };

  const downloadStrip = () => {
    const canvas = document.createElement("canvas");
    const width = 300;
    const height = 600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    stripPhotos.forEach((photo, index) => {
      const img = new Image();
      img.src = photo.src;
      img.onload = () => {
        ctx.filter = filters[photo.filter];
        ctx.drawImage(img, 0, index * 150, width, 150);
        if (index === stripPhotos.length - 1) {
          const link = document.createElement("a");
          link.download = "photo-strip.png";
          link.href = canvas.toDataURL();
          link.click();
        }
      };
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💗Photo Booth💅</h1>

      <div style={styles.webcamContainer}>
        <div style={styles.webcamFrame}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            style={{
              width: 300,
              height: 200,
              borderRadius: "12px",
              filter: filters[selectedFilter],
            }}
          />
        </div>
      </div>

      <div style={styles.filterRow}>
        {Object.keys(filters).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedFilter(key)}
            style={{
              ...styles.filterButton,
              backgroundColor: selectedFilter === key ? "#ff80ab" : "#fce4ec",
              color: selectedFilter === key ? "white" : "#880e4f",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <button onClick={capture} style={styles.captureButton}>
        📸 Capture Photo
      </button>

      {stripPhotos.length > 0 && (
        <>
          <h3 style={styles.stripTitle}>🎀 Your Cute Strip</h3>
          <div style={styles.stripBox}>
            {stripPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo.src}
                alt={`strip-${idx}`}
                className="fade-in"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  filter: filters[photo.filter],
                  borderBottom: "2px dashed #ffb6c1",
                }}
              />
            ))}
          </div>

          <button onClick={downloadStrip} style={styles.downloadButton}>
            ⬇️ Download Strip
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to bottom right, #ffe4ec, #f8bbd0)",
    minHeight: "100vh",
    padding: "2rem",
    textAlign: "center",
    fontFamily: "'Poppins', cursive",
  },
  title: {
    color: "#ad1457",
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
  },
  webcamContainer: {
    display: "flex",
    justifyContent: "center",
  },
  webcamFrame: {
    padding: "10px",
    border: "4px dotted #f06292",
    borderRadius: "20px",
    backgroundColor: "#fff0f5",
    boxShadow: "0 0 10px rgba(255,105,180,0.5)",
  },
  filterRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.6rem",
    marginTop: "1rem",
  },
  filterButton: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  captureButton: {
    marginTop: "1.2rem",
    padding: "0.8rem 1.6rem",
    backgroundColor: "#ec407a",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(236,64,122,0.4)",
    transition: "transform 0.2s ease",
  },
  stripTitle: {
    marginTop: "2rem",
    fontSize: "22px",
    color: "#880e4f",
  },
  stripBox: {
    width: "300px",
    margin: "1rem auto",
    background: "#fff",
    borderRadius: "16px",
    padding: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    overflow: "hidden",
    animation: "fadeIn 1s ease",
  },
  downloadButton: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    fontSize: "16px",
    backgroundColor: "#c51162",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(197,17,98,0.4)",
  },
};

export default App;

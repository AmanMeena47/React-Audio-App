import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS file for styling

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(null);

  useEffect(() => {
    // Load playlist from local storage on component mount
    const savedPlaylist = localStorage.getItem('playlist');
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
    
    // Load last playing track index from local storage
    const savedTrackIndex = localStorage.getItem('currentTrackIndex');
    if (savedTrackIndex !== null) {
      setCurrentTrackIndex(parseInt(savedTrackIndex, 10));
    }
  }, []);

  useEffect(() => {
    // Save playlist to local storage whenever it changes
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    // Save current track index to local storage whenever it changes
    localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
  }, [currentTrackIndex]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedPlaylist = [...playlist, ...files];
    setPlaylist(updatedPlaylist);
  };

  const handlePlayTrack = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="app-container">
      <div className="file-upload">
        <label htmlFor="file-input" className="file-label">Choose File</label>
        <input
          id="file-input"
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }} // Hide the original file input
        />
      </div>
      <div className="playlist-container">
        <h2 className="playlist-heading">Playlist</h2>
        <ul className="playlist">
          {playlist.map((track, index) => (
            <li key={index} className={index === currentTrackIndex ? 'active-track' : ''}>
              <button onClick={() => handlePlayTrack(index)} className="play-button">
                Play
              </button>
              <span className="track-name">{track.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="player-container">
        {playlist.length > 0 && (
          <>
            <audio
              controls
              ref={(ref) => setAudioPlayer(ref)}
              onEnded={handleTrackEnded}
              src={URL.createObjectURL(playlist[currentTrackIndex])}
              autoPlay
              className="audio-player"
            />
            <div className="controls">
              <button onClick={handlePrevious} className="control-button">
                Previous
              </button>
              <button onClick={handleNext} className="control-button">
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

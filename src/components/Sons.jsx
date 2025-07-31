import React, { useState, useRef, useEffect } from 'react';

const Sons = ({ Songs }) => {
  const [isPlaying, setIsPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const audioRefs = useRef([]);

  const handlePlayPause = (index) => {
    if (isPlaying === index) {
      audioRefs.current[index].pause();
      setIsPlaying(null);
    } else {
      if (isPlaying !== null && audioRefs.current[isPlaying]) {
        audioRefs.current[isPlaying].pause();
      }
      audioRefs.current[index].play();
      setIsPlaying(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying !== null && audioRefs.current[isPlaying]) {
        const audio = audioRefs.current[isPlaying];
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-gray-700 shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">🎵 Recommended Songs</h2>

      {Songs.length === 0 ? (
        <p className="text-gray-300 text-center">
          Your song list will appear here after detecting your mood.
        </p>
      ) : (
        <div className="space-y-4">
          {Songs.map((song, index) => (
            <div
              key={index}
              className="flex flex-col bg-gray-600 rounded-xl p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{song.title}</h3>
                  <p className="text-gray-300">{song.artist}</p>
                </div>
                <button
                  onClick={() => handlePlayPause(index)}
                  className="text-indigo-400 hover:text-indigo-500 text-4xl ml-4"
                >
                  {isPlaying === index ? (
                    <i className="ri-pause-circle-fill"></i>
                  ) : (
                    <i className="ri-play-circle-fill"></i>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {isPlaying === index && (
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-500 rounded-full">
                    <div
                      className="h-2 bg-indigo-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.audio}
                onEnded={() => {
                  setIsPlaying(null);
                  setProgress(0);
                }}
                style={{ display: "none" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sons;

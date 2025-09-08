import { useState, useRef, useEffect } from "react";
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Bell,
  User,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentSong, setCurrentSong] = useState(null); // song object
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const audioRef = useRef(null);

  const songs = [
    {
      title: "PwerHouse",
      artist: "Anirudh Ravichander",
      image:
        "https://c.saavncdn.com/981/Coolie-Disco-From-Coolie-Tamil-2024-20240509170935-500x500.jpg",
      audio: "/src/data/Powerhouse.mp3",
    },
    {
      title: "I'm the Danger",
      artist: " Siddharth Basrur, Anirudh Ravichander, Heisenberg",
      image:
        "https://c.saavncdn.com/497/Coolie-Original-Motion-Picture-Soundtrack-Kannada-2025-20250814103505-500x500.jpg",
      audio:
        "https://pagalfree.com/musics/128-Im%20The%20Danger%20-%20Coolie%20128%20Kbps.mp3",
    },
    {
      title: "God Bless You",
      artist: " G.V. Prakash Kumar, Anirudh Ravichander, Paal Dabba, Rokesh",
      image:
        "https://c.saavncdn.com/357/God-Bless-U-From-Good-Bad-Ugly-Tamil-2025-20250329191006-500x500.jpg",
      audio:
        "https://pagalfree.com/musics/128-God%20Bless%20U%20-%20Good%20Bad%20Ugly%20128%20Kbps.mp3",
    },
    {
      title: "Hukum",
      artist: "Anirudh Ravichander, Super Subu",
      image:
        "https://c.saavncdn.com/959/Hukum-Thalaivar-Alappara-From-Jailer-Tamil-2023-20230717071502-500x500.jpg",
      audio:
        "https://pagalfree.com/musics/128-Hukum%20-%20Thalaivar%20Alappara%20-%20Jailer%20128%20Kbps.mp3",
    },
    {
      title: "Believer",
      artist: "Imagine Dragons",
      image:
        "https://c.saavncdn.com/248/Evolve-English-2017-20180716230950-500x500.jpg",
      audio:
        "https://pagalfree.com/musics/128-Believer%20-%20Imagine%20Dragons%20128%20Kbps.mp3",
    },
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      image:
        "https://c.saavncdn.com/286/WMG_190295851286-English-2017-500x500.jpg",
      audio:
        "https://pagalfree.com/musics/128-Perfect%20-%20Ed%20Sheeran%20128%20Kbps.mp3",
    },
  ];

  // handle play/pause
  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // handle song selection
  const playSong = (song) => {
    if (currentSong?.title === song.title) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setTimeout(() => {
        audioRef.current.play();
        setIsPlaying(true);
      }, 200);
    }
  };

  // handle skip
  const skipSong = (direction) => {
    if (!currentSong) return;
    const index = songs.findIndex((s) => s.title === currentSong.title);
    let newIndex = direction === "next" ? index + 1 : index - 1;
    if (newIndex >= songs.length) newIndex = 0;
    if (newIndex < 0) newIndex = songs.length - 1;
    playSong(songs[newIndex]);
  };

  // progress update
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && currentSong) {
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentSong]);

  // volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-zinc-900 to-neutral-800">
        {/* Left: Logo and Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          <span className="font-bold text-lg hidden md:block">Spotify</span>
        </div>

        {/* Center: Home + Search */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex items-center gap-4 sm:gap-6 w-full max-w-lg">
            <Home
              size={24}
              className={`cursor-pointer ${
                activeTab === "home" ? "text-green-500" : "text-white"
              } hover:text-green-500 transition-colors`}
              onClick={() => setActiveTab("home")}
            />
            <div className="hidden sm:flex items-center bg-neutral-700 rounded-full flex-1 px-4 py-2">
              <Search className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="What do you want to play?"
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hidden sm:flex items-center gap-4">
          <button className="bg-white text-black px-4 py-1 rounded-full font-semibold hover:scale-105 transition text-sm">
            Premium
          </button>
          <Bell className="hidden md:block" />
          <User className="bg-orange-600 rounded-full p-1 w-8 h-8 cursor-pointer" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-56 bg-neutral-950 p-4 flex-col gap-6">
          <button className="flex items-center gap-3 hover:text-green-500">
            <Home /> Home
          </button>
          <button className="flex items-center gap-3 hover:text-green-500">
            <Search /> Search
          </button>
          <button className="flex items-center gap-3 hover:text-green-500">
            <Library /> Your Library
          </button>

          <hr className="border-neutral-700" />

          <button className="flex items-center gap-3 hover:text-green-500">
            <Plus /> Create Playlist
          </button>
          <button className="flex items-center gap-3 hover:text-green-500">
            <Heart /> Liked Songs
          </button>
        </div>

       {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-neutral-900 to-black overflow-y-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          It’s New Music Friday!
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.map((song, i) => (
            <div
              key={i}
              onClick={() => playSong(song)}
              className="bg-neutral-800 p-3 sm:p-4 rounded-xl hover:bg-neutral-700 transition cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={song.image}
                  alt={song.title}
                  className="h-24 sm:h-40 w-full object-cover rounded-md mb-3"
                />
                <div className="absolute bottom-6 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <button className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    {currentSong?.title === song.title && isPlaying ? (
                      <Pause size={22} fill="black" />
                    ) : (
                      <Play size={22} fill="black" />
                    )}
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base">
                {song.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Player */}
      <div className="h-16 sm:h-20 bg-neutral-900 flex items-center justify-between px-3 sm:px-6 border-t border-neutral-700">
        {/* Song Info */}
        <div className="flex items-center gap-2 sm:gap-4 w-1/3">
          {currentSong ? (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-md"
            />
          ) : (
            <div className="h-10 w-10 sm:h-14 sm:w-14 bg-neutral-700 rounded-md"></div>
          )}
          <div className="hidden sm:block">
            <h4 className="font-semibold text-sm">
              {currentSong ? currentSong.title : "Song Title"}
            </h4>
            <p className="text-xs text-gray-400">
              {currentSong ? currentSong.artist : "Artist"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 sm:gap-2 w-1/3">
          <div className="flex items-center gap-4 sm:gap-6">
            <SkipBack
              onClick={() => skipSong("prev")}
              className="cursor-pointer"
            />
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:scale-110 transition"
            >
              {isPlaying ? (
                <Pause size={24} fill="black" />
              ) : (
                <Play size={24} fill="black" />
              )}
            </button>
            <SkipForward
              onClick={() => skipSong("next")}
              className="cursor-pointer"
            />
          </div>
          <div className="hidden sm:flex items-center gap-3 w-full">
            <span className="text-xs">0:00</span>
            <div className="flex-1 h-1 bg-neutral-600 rounded-full">
              <div
                className="h-1 bg-green-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs">3:45</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex w-1/3 justify-end items-center gap-2">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 sm:w-24"
          />
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentSong?.audio}
        onEnded={() => skipSong("next")}
      />


      {/* Mobile Bottom Nav */}
      <div className="flex md:hidden bg-neutral-950 border-t border-neutral-700 justify-around py-2">
        <button
          className={`flex flex-col items-center text-xs ${
            activeTab === "home" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Home size={20} /> Home
        </button>
        <button
          className={`flex flex-col items-center text-xs ${
            activeTab === "search" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("search")}
        >
          <Search size={20} /> Search
        </button>
        <button
          className={`flex flex-col items-center text-xs ${
            activeTab === "library" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("library")}
        >
          <Library size={20} /> Library
        </button>
      </div>
    </div>
    </div>
  );
}

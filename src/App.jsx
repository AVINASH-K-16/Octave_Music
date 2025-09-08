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
  X,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedSongs, setLikedSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const audioRef = useRef(null);

  // state for Playlists
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(null);

  // Song Datas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const songs = [
    {
      title: "PowerHouse",
      artist: "Anirudh Ravichander",
      image:
        "https://c.saavncdn.com/981/Coolie-Disco-From-Coolie-Tamil-2024-20240509170935-500x500.jpg",
      audio: "./src/data/Powerhouse.mp3",
    },
    {
      title: "I'm the Danger",
      artist: " Siddharth Basrur, Anirudh Ravichander, Heisenberg",
      image:
        "https://c.saavncdn.com/497/Coolie-Original-Motion-Picture-Soundtrack-Kannada-2025-20250814103505-500x500.jpg",
      audio: "src/data/I Am The Danger - Siddharth Basrur.mp3",
    },
    {
      title: "God Bless You",
      artist: " G.V. Prakash Kumar, Anirudh Ravichander, Paal Dabba, Rokesh",
      image:
        "https://c.saavncdn.com/357/God-Bless-U-From-Good-Bad-Ugly-Tamil-2025-20250329191006-500x500.jpg",
      audio: "src/data/God Bless You.mp3",
    },
    {
      title: "Hukum",
      artist: "Anirudh Ravichander, Super Subu",
      image:
        "https://c.saavncdn.com/959/Hukum-Thalaivar-Alappara-From-Jailer-Tamil-2023-20230717071502-500x500.jpg",
      audio: "src/data/Hukum.mp3",
    },
    {
      title: "Believer",
      artist: "Imagine Dragons",
      image:
        "https://c.saavncdn.com/248/Evolve-English-2017-20180716230950-500x500.jpg",
      audio: "src/data/Imagine Dragons - Believer (Lyrics) - 7clouds.mp3",
    },
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      image:
        "https://c.saavncdn.com/286/WMG_190295851286-English-2017-500x500.jpg",
      audio: "src/data/Ed Sheeran - Perfect - LatinHype.mp3",
    },
    {
      title: "Kathalikathey Maname",
      artist: "HipHop Tamizha",
      image:
        "https://c.saavncdn.com/015/Imaikkaa-Nodigal-Tamil-2017-20240208130403-500x500.jpg",
      audio:
        "src/data/Kadhalikathey (lyrics)  Imaika Nodigal  HIP HOP THAMIZHA - Sing Along.mp3",
    },
  ];

  //  initial filtered songs
  useEffect(() => {
    setFilteredSongs(songs);
  }, [songs]);

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
    if (currentSong?.title === song.title && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (currentSong?.title === song.title && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  // handle skip
  const skipSong = (direction) => {
    if (!currentSong) return;
    const currentList =
      activeTab === "liked"
        ? likedSongs
        : activeTab === "library" && selectedPlaylist
        ? selectedPlaylist.songs
        : songs;
    const index = currentList.findIndex((s) => s.title === currentSong.title);
    let newIndex = direction === "next" ? index + 1 : index - 1;
    if (newIndex >= currentList.length) newIndex = 0;
    if (newIndex < 0) newIndex = currentList.length - 1;
    playSong(currentList[newIndex]);
  };

  // Update audio source and play/pause when currentSong or isPlaying changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audio;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Playback failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  // progress update and volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateProgress);
      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
      };
    }
  }, [volume, currentSong]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSongs(songs);
    } else {
      const lower = searchTerm.toLowerCase();
      const results = songs.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.artist.toLowerCase().includes(lower)
      );
      setFilteredSongs(results);
    }
  }, [searchTerm, songs]);

  // Toggle Like
  const toggleLike = (song) => {
    if (likedSongs.find((s) => s.title === song.title)) {
      setLikedSongs(likedSongs.filter((s) => s.title !== song.title));
    } else {
      setLikedSongs([...likedSongs, song]);
    }
  };

  // time formatter
  const formatTime = (time) => {
    if (isNaN(time) || time === undefined || time === null) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handler for clicking the progress bar to seek
  const handleProgressClick = (e) => {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return;

    const progressBarRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const newProgressPercentage = (clickX / progressBarWidth) * 100;
    const newTime = (newProgressPercentage / 100) * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress(newProgressPercentage);
  };

  // New Playlist Functions
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() === "") return;
    const newPlaylist = {
      id: Date.now(),
      name: newPlaylistName,
      songs: [],
    };
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

  const handleAddSongToPlaylist = (song, playlistId) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, song] }
          : playlist
      )
    );
  };

  const handleRemovePlaylist = (e, playlistId) => {
    e.stopPropagation();
    const updatedPlaylists = playlists.filter((pl) => pl.id !== playlistId);
    setPlaylists(updatedPlaylists);

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  //  playlists to localStorage
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden transition-opacity duration-700 ease-in-out">
      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-sm transform scale-95 transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create new playlist</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-2 bg-neutral-700 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
            <button
              onClick={handleCreatePlaylist}
              className="w-full bg-green-500 text-black font-semibold py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-zinc-900 to-neutral-800">
        <div className="flex items-center justify-center gap-2">
          <div className="w-full h-15  rounded-full">
            <img
              src="src/data/Logo-removebg-preview.png"
              className="w-full p-[-25px] h-[80px] mt-[-15px] bg-white object-cover rounded-[15px]"
              alt="Image"
            />
          </div>
          <span className="font-bold text-lg hidden md:block">OctaveOasis</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex items-center gap-4 sm:gap-6 w-full max-w-lg">
            <Home
              size={30}
              className={`cursor-pointer transition-colors ${
                activeTab === "home" ? "text-red-950" : "text-white"
              } hover:text-green-500`}
              onClick={() => setActiveTab("home")}
            />
            <div className="flex items-center bg-neutral-700 rounded-full flex-1 px-4 py-2 transition-colors">
              <Search className="text-gray-400 mr-2 transition-colors" />
              <input
                type="text"
                placeholder="Search by song or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <button className="bg-white text-gray-200 px-4 py-1 rounded-full font-semibold hover:scale-105 transition-transform text-sm">
            Premium
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-56 bg-neutral-950 p-4 flex-col gap-6">
          <button
            className={`flex items-center gap-3 hover:text-green-500 transition-colors ${
              activeTab === "home" ? "text-green-500" : "text-white"
            }`}
            onClick={() => {
              setActiveTab("home");
              setSelectedPlaylist(null);
            }}
          >
            <Home /> Home
          </button>
          <button
            className={`flex items-center gap-3 hover:text-green-500 transition-colors ${
              activeTab === "search" ? "text-green-500" : "text-white"
            }`}
            onClick={() => {
              setActiveTab("search");
              setSelectedPlaylist(null);
            }}
          >
            <Search /> Search
          </button>
          <hr className="border-neutral-700" />
          <button
            className="flex items-center gap-3 hover:text-green-500 transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus /> Create Playlist
          </button>
          <button
            className={`flex items-center gap-3 hover:text-green-500 transition-colors ${
              activeTab === "liked" ? "text-green-500" : "text-white"
            }`}
            onClick={() => {
              setActiveTab("liked");
              setSelectedPlaylist(null);
            }}
          >
            <Heart /> Liked Songs
          </button>
          <hr className="border-neutral-700" />
          <div className="flex-1 overflow-y-auto space-y-5">
            <h4 className="text-gray-400 font-semibold mb-2">Playlists</h4>
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={`flex items-center justify-between group cursor-pointer w-full text-left py-1 hover:text-green-500 transition-colors ${
                  selectedPlaylist?.id === playlist.id
                    ? "text-green-500"
                    : "text-white"
                }`}
                onClick={() => {
                  setActiveTab("library");
                  setSelectedPlaylist(playlist);
                }}
              >
                <div className="flex items-center gap-3">
                  <Library /> {playlist.name}
                </div>
                <button
                  onClick={(e) => handleRemovePlaylist(e, playlist.id)}
                  className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-neutral-900 transition-opacity duration-500">
          {activeTab === "search" && (
            <div className="mb-4">
              <div className="flex items-center bg-neutral-700 rounded-full px-4 py-2 w-full max-w-lg transition-colors">
                <Search className="text-gray-400 mr-2 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by song or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm transition-colors"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(activeTab === "liked"
              ? likedSongs
              : activeTab === "library" && selectedPlaylist
              ? selectedPlaylist.songs
              : filteredSongs
            ).map((song, i) => (
              <div
                key={i}
                onClick={() => playSong(song)}
                className="bg-neutral-800 p-3 sm:p-4 rounded-xl hover:bg-neutral-700 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
              >
                <div className="relative">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="h-24 sm:h-40 w-full object-cover rounded-md mb-3 transition-transform duration-300"
                  />
                  <div className="absolute bottom-6 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <button
                      className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentSong?.title === song.title) {
                          togglePlay();
                        } else {
                          playSong(song);
                        }
                      }}
                    >
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
                <p className="text-xs sm:text-sm text-gray-400">
                  {song.artist}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(song);
                  }}
                  className={`mt-2 transition-colors ${
                    likedSongs.find((s) => s.title === song.title)
                      ? "text-green-500"
                      : "text-gray-400"
                  } hover:text-green-500`}
                >
                  <Heart />
                </button>
                <div className="relative mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddMenu(
                        showAddMenu?.title === song.title ? null : song
                      );
                    }}
                    className="text-gray-400 hover:text-green-500 text-xs transition-colors"
                  >
                    Add to Playlist
                  </button>
                  {showAddMenu?.title === song.title && (
                    <div className="absolute left-0 top-full mt-2 bg-neutral-700 p-2 rounded shadow-lg z-10 w-40 transition-opacity duration-300">
                      {playlists.length > 0 ? (
                        playlists.map((pl) => (
                          <button
                            key={pl.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddSongToPlaylist(song, pl.id);
                              setShowAddMenu(null);
                            }}
                            className="block w-full text-left py-1 hover:bg-neutral-600 rounded transition-colors"
                          >
                            {pl.name}
                          </button>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">
                          No playlists found.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Player */}
      <div className="h-16 sm:h-20 bg-neutral-900 flex items-center justify-between px-3 sm:px-6 border-t border-neutral-700">
        <div className="flex items-center gap-2 sm:gap-4 w-1/3">
          {currentSong ? (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-md animate-spin-slow transition-all"
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
        <div className="flex flex-col items-center gap-1 sm:gap-2 w-1/3">
          <div className="flex items-center gap-4 sm:gap-6">
            <SkipBack
              onClick={() => skipSong("prev")}
              className="cursor-pointer text-gray-400 hover:text-white transition-colors hover:scale-110"
            />
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <Pause size={24} fill="black" />
              ) : (
                <Play size={24} fill="black" />
              )}
            </button>
            <SkipForward
              onClick={() => skipSong("next")}
              className="cursor-pointer text-gray-400 hover:text-white transition-colors hover:scale-110"
            />
          </div>
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs">
              {formatTime(audioRef.current?.currentTime)}
            </span>
            <div
              className="flex-1 h-1 bg-neutral-600 rounded-full cursor-pointer transition-colors"
              onClick={handleProgressClick}
            >
              <div
                className="h-1 bg-green-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs">
              {formatTime(audioRef.current?.duration)}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex w-1/3 justify-end items-center gap-2">
          <Volume2 size={20} className="text-gray-400 transition-colors" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 sm:w-24 accent-green-500 transition-colors"
          />
        </div>
      </div>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentSong?.audio}
        onEnded={() => skipSong("next")}
        onError={(e) => console.error("Audio error:", e)}
      />
      {/* Mobile Bottom Nav */}
      <div className="flex md:hidden bg-neutral-950 border-t border-neutral-700 justify-around py-2">
        <button
          className={`flex flex-col items-center text-xs transition-colors ${
            activeTab === "home" ? "text-white" : "text-gray-400"
          } hover:text-white`}
          onClick={() => setActiveTab("home")}
        >
          <Home size={20} /> Home
        </button>
        <button
          className={`flex flex-col items-center text-xs transition-colors ${
            activeTab === "search" ? "text-white" : "text-gray-400"
          } hover:text-white`}
          onClick={() => setActiveTab("search")}
        >
          <Search size={20} /> Search
        </button>
        <button
          className={`flex flex-col items-center text-xs transition-colors ${
            activeTab === "library" ? "text-white" : "text-gray-400"
          } hover:text-white`}
          onClick={() => setActiveTab("library")}
        >
          <Library size={20} /> Library
        </button>
      </div>
    </div>
  );
}

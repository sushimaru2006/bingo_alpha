import { ArrowLeft, Check, Music, Search, Play, Pause, Eye, EyeOff, LogIn, RefreshCw, Maximize, Minimize, ListMusic, X, Plus, Trash2, Save } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { searchSpotify, playSpotifyTrack } from '../utils/spotify';
import { useSpotify } from '../contexts/SpotifyContext';

const IntroQuizMode = ({ onBack, onRegister }) => {
    // Consume Global Context
    const spotifyContext = useSpotify();

    if (!spotifyContext) {
        return <div className="text-white p-10">Error: SpotifyContext is null. Please refresh.</div>;
    }

    const { token, player, deviceId, isActive, login } = spotifyContext;

    // Local UI State
    const [number, setNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showTrackList, setShowTrackList] = useState(false);
    const containerRef = useRef(null);

    // Play History
    const [playedHistory, setPlayedHistory] = useState(() => {
        try {
            const saved = localStorage.getItem("intro_quiz_history");
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse history", e);
            return [];
        }
    });

    // Effect: Handle Volume for Intro Quiz Mode
    useEffect(() => {
        if (!player) return;

        console.log("IntroQuiz Mounted: Setting Volume 0.5");
        player.setVolume(0.5).catch(e => console.error("Volume set failed", e));

        return () => {
            console.log("IntroQuiz Unmounted: Pausing Playback");
            player.pause().catch(e => console.error("Pause failed", e));
        };
    }, [player]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery || !token) return;
        try {
            const tracks = await searchSpotify(searchQuery, token);
            setSearchResults(tracks);
            setShowResults(true);
        } catch (error) {
            console.error("Spotify search failed", error);
            alert("Search failed. Token may be expired. Please re-login.");
        }
    };

    const getUniqueKey = (target) => {
        if (target.type === 'track') return `${target.title}-${target.artist}`;
        return `artist-${target.name}`;
    };

    // List of targets (artists or specific tracks)
    const DEFAULT_TARGETS = [
        // 合唱コン
        { type: "track", title: "Let's search for Tomorrow", artist: "田中安茂", start_ms: 72000 },
        { type: "track", title: "夢を追いかけて", artist: "舘内聖美", start_ms: 50000 },
        { type: "track", title: "With You Smile", artist: "藤井宏樹", start_ms: 72500 },
        { type: "track", title: "心の瞳", artist: "田中安茂", start_ms: 57000 },
        { type: "track", title: "時の旅人", artist: "神代混成合唱団", start_ms: 90000 },
        { type: "track", title: "瑠璃色の地球", artist: "小金井市立緑中学校", start_ms: 61000 },
        { type: "track", title: "旅立ちの時", artist: "どさんこんさーと", start_ms: 85000 },
        { type: "track", title: "ヒカリ", artist: "松下", start_ms: 0 },
        { type: "track", title: "手紙", artist: "合唱団轟", start_ms: 48000 },
        // 俺選びトラック
        { type: "track", title: "Tokimeki", artist: "Vaundy", start_ms: 0 },
        { type: "track", title: "IRIS OUT", artist: "米津", start_ms: 0 },
        { type: "track", title: "Wasted Nights", artist: "One Ok Rock", start_ms: 42000 },
    ];

    const [targets, setTargets] = useState(() => {
        try {
            const saved = localStorage.getItem("intro_quiz_targets");
            return saved ? JSON.parse(saved) : DEFAULT_TARGETS;
        } catch (e) {
            return DEFAULT_TARGETS;
        }
    });

    // New Track Input State
    const [newTrackTitle, setNewTrackTitle] = useState('');
    const [newTrackArtist, setNewTrackArtist] = useState('');
    const [newTrackStart, setNewTrackStart] = useState('0');

    useEffect(() => {
        localStorage.setItem("intro_quiz_targets", JSON.stringify(targets));
    }, [targets]);

    const addTarget = () => {
        if (!newTrackTitle || !newTrackArtist) return;
        const newTarget = {
            type: "track",
            title: newTrackTitle,
            artist: newTrackArtist,
            start_ms: parseInt(newTrackStart) * 1000 // Convert sec to ms
        };
        setTargets([...targets, newTarget]);
        setNewTrackTitle('');
        setNewTrackArtist('');
        setNewTrackStart('0');
    };

    const removeTarget = (index) => {
        if (confirm("Remove this track from the list?")) {
            const newTargets = targets.filter((_, i) => i !== index);
            setTargets(newTargets);
        }
    };

    const playTarget = async (target) => {
        const targetKey = getUniqueKey(target);

        let query = searchQuery;
        if (!query) {
            if (target.type === 'artist') {
                query = `"${target.name}"`;
            } else if (target.type === 'track') {
                query = `"${target.title}" "${target.artist}"`;
            }
        }

        try {
            let tracks = await searchSpotify(query, token);

            if (tracks && tracks.length > 0) {
                const topTrack = tracks[0];
                const startMs = target.start_ms || 0;

                await handlePlay(topTrack, startMs);

                // Add to history
                const newHistory = [...playedHistory, targetKey];
                // Remove duplicates just in case
                const uniqueHistory = [...new Set(newHistory)];

                setPlayedHistory(uniqueHistory);
                localStorage.setItem("intro_quiz_history", JSON.stringify(uniqueHistory));

            } else {
                alert(`No tracks found for ${query}.`);
            }
        } catch (error) {
            console.error("Play target failed", error);
            if (error.message === "Token Expired") {
                alert("Spotify token has expired. Please log in again.");
                localStorage.removeItem("spotify_access_token");
                window.location.reload();
            } else {
                alert(error.message);
            }
        }
    };

    const handleRandomPlay = async () => {
        if (!token) return;

        // Filter out played targets
        const availableTargets = targets.filter(t => !playedHistory.includes(getUniqueKey(t)));

        if (availableTargets.length === 0) {
            if (window.confirm("All songs have been played! Reset history?")) {
                setPlayedHistory([]);
                localStorage.removeItem("intro_quiz_history");
                return; // User can click again to play
            }
            return;
        }

        // Pick one random target from available
        const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
        await playTarget(target);
    };

    const handlePlay = async (track, position_ms = 0) => {
        if (!deviceId) {
            alert("Player not ready yet. Please wait a moment.");
            return;
        }

        try {
            await playSpotifyTrack(token, deviceId, track.uri, position_ms);
            setSelectedTrack(track);
            setIsRevealed(false);
            setShowResults(false);
            setIsPlaying(true);
        } catch (e) {
            alert("Playback failed: " + e.message);
        }
    };

    const togglePlay = () => {
        if (player) {
            player.togglePlay();
            setIsPlaying(!isPlaying); // Optimistic UI update
        }
    };

    const handleResetHistory = () => {
        if (window.confirm("Reset played song history?")) {
            setPlayedHistory([]);
            localStorage.removeItem("intro_quiz_history");
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    // Listen for Escape key or browser exit
    useEffect(() => {
        const handleChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (number) {
            onRegister(number);
            setNumber('');
            onBack();
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-[#191414] text-white">
                <div className="flex flex-col items-center gap-6 p-8 bg-black/40 rounded-3xl backdrop-blur-md border border-white/10">
                    <Music size={64} className="text-[#1DB954]" />
                    <h1 className="text-3xl font-bold">Spotify Login Required</h1>
                    <p className="text-gray-400">Please login with a Premium account to use this feature.</p>
                    <button
                        onClick={login}
                        className="flex items-center gap-3 px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full text-xl transition-all hover:scale-105"
                    >
                        <LogIn size={24} />
                        Login with Spotify
                    </button>
                    <button onClick={onBack} className="text-sm text-gray-500 hover:text-white underline">
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col items-center h-screen w-full bg-[#1DB954] text-white relative overflow-hidden p-4 font-sans">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[12px] border-white rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[12px] border-white rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[12px] border-white rounded-full animate-ping [animation-duration:3s] [animation-delay:2s]"></div>
            </div>

            {/* FULL SCREEN PROJECTOR MODE OVERLAY */}
            {isFullScreen && selectedTrack && (
                <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
                    <div className="absolute top-4 right-4 z-50">
                        <button onClick={toggleFullScreen} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                            <Minimize size={40} />
                        </button>
                    </div>

                    {/* Big Album Art */}
                    <div className={`relative w-[60vh] h-[60vh] mb-8 shadow-2xl transition-all duration-1000 ${isRevealed ? 'blur-0' : 'blur-3xl grayscale'}`}>
                        {selectedTrack.album.images[0] && (
                            <img src={selectedTrack.album.images[0].url} alt="Album Art" className="w-full h-full object-cover rounded-xl" />
                        )}
                    </div>

                    {/* Big Text Info */}
                    <div className="text-center w-full px-8 space-y-4">
                        {isRevealed ? (
                            <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
                                <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4">{selectedTrack.name}</h2>
                                <p className="text-3xl md:text-5xl text-gray-300 font-bold">{selectedTrack.artists.map(a => a.name).join(", ")}</p>
                            </div>
                        ) : (
                            <div className="text-white/20 text-6xl font-black tracking-widest animate-pulse">
                                ???
                            </div>
                        )}
                    </div>

                    {/* Minimal Controls */}
                    <div className="absolute bottom-10 flex gap-8">
                        <button onClick={() => setIsRevealed(!isRevealed)} className="p-6 bg-yellow-400 text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                            {isRevealed ? <EyeOff size={48} /> : <Eye size={48} />}
                        </button>
                        <button onClick={togglePlay} className="p-6 bg-[#1DB954] text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                            {isPlaying ? <Pause size={48} fill="black" /> : <Play size={48} fill="black" />}
                        </button>
                    </div>
                </div>
            )}


            <div className={`z-10 w-full max-w-6xl flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 h-full overflow-y-auto custom-scrollbar ${isFullScreen ? 'opacity-0 pointer-events-none' : ''}`}>

                {/* Header */}
                <div className="flex items-center gap-4 mt-8 flex-col md:flex-row landscape:flex-row text-center md:text-left landscape:text-left">
                    <div className="p-4 bg-black/20 rounded-full backdrop-blur-lg">
                        <Music size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-display drop-shadow-lg">INTRO QUIZ</h1>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 landscape:grid-cols-2 gap-8">

                    {/* Left: Search & Player */}
                    <div className="flex flex-col gap-6 bg-black/20 p-6 rounded-3xl backdrop-blur-md">
                        {/* 
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search song (Spotify)..."
                                className="flex-1 px-4 py-3 rounded-xl text-black font-bold focus:outline-none"
                            />
                            <button type="submit" className="p-3 bg-black rounded-xl hover:bg-gray-800 transition-colors">
                                <Search size={24} />
                            </button>
                        </form>
                        */}

                        <button
                            onClick={handleRandomPlay}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
                        >
                            <Music size={20} /> Random Play ({targets.length - playedHistory.length} left)
                        </button>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowTrackList(true)}
                                className="text-sm text-white/70 hover:text-white flex items-center gap-1"
                            >
                                <ListMusic size={16} /> Track List
                            </button>
                            <button onClick={handleResetHistory} className="text-sm text-white/50 hover:text-white flex items-center gap-1">
                                <RefreshCw size={12} /> Reset History
                            </button>
                        </div>

                        {/* Track List Modal */}
                        {showTrackList && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                                <div className="bg-gray-900 w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh]">
                                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <ListMusic className="text-[#1DB954]" /> Track List
                                        </h2>
                                        <button onClick={() => setShowTrackList(false)} className="p-2 hover:bg-white/10 rounded-full">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl mb-4 space-y-3 border border-white/10">
                                        <h3 className="font-bold text-sm text-gray-400 uppercase">Add New Track</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input
                                                placeholder="Title"
                                                value={newTrackTitle}
                                                onChange={e => setNewTrackTitle(e.target.value)}
                                                className="bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#1DB954]"
                                            />
                                            <input
                                                placeholder="Artist"
                                                value={newTrackArtist}
                                                onChange={e => setNewTrackArtist(e.target.value)}
                                                className="bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#1DB954]"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                placeholder="Start (sec)"
                                                value={newTrackStart}
                                                onChange={e => setNewTrackStart(e.target.value)}
                                                className="w-28 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#1DB954]"
                                            />
                                            <button
                                                onClick={addTarget}
                                                disabled={!newTrackTitle || !newTrackArtist}
                                                className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg flex items-center justify-center gap-2 text-base transition-transform active:scale-95"
                                            >
                                                <Plus size={20} /> Add Track
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {targets.map((target, index) => {
                                            const key = getUniqueKey(target);
                                            const isPlayed = playedHistory.includes(key);
                                            return (
                                                <div key={index} className={`w-full flex items-center gap-2 p-3 rounded-xl transition-all ${isPlayed ? 'bg-white/5' : 'bg-white/10 hover:bg-white/15'}`}>
                                                    <button
                                                        onClick={() => {
                                                            playTarget(target);
                                                            setShowTrackList(false);
                                                        }}
                                                        className="flex-1 text-left"
                                                    >
                                                        <div>
                                                            <p className={`font-bold text-lg ${isPlayed ? 'opacity-50 line-through' : ''}`}>{target.title || target.name}</p>
                                                            <p className="text-sm text-gray-400">{target.artist} {target.start_ms > 0 && `(Start: ${target.start_ms / 1000}s)`}</p>
                                                        </div>
                                                    </button>

                                                    {isPlayed && <span className="text-xs bg-[#1DB954] text-black px-2 py-1 rounded-full font-bold">DONE</span>}

                                                    <button
                                                        onClick={() => removeTarget(index)}
                                                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Player Controls */}
                        <div className="flex flex-col items-center gap-4 mt-4 p-4 bg-black/40 rounded-2xl border border-white/10">

                            {selectedTrack ? (
                                <>
                                    <div className={`relative w-48 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isRevealed ? 'blur-0' : 'blur-md'}`}>
                                        {selectedTrack.album.images[1] && (
                                            <img src={selectedTrack.album.images[1].url} alt="Album Art" className="w-full h-full object-cover" />
                                        )}
                                    </div>

                                    <div className="text-center h-16 flex flex-col justify-center w-full px-4">
                                        {isRevealed ? (
                                            <>
                                                <p className="text-xl font-bold truncate w-full">{selectedTrack.name}</p>
                                                <p className="opacity-80 truncate w-full">{selectedTrack.artists.map(a => a.name).join(", ")}</p>
                                            </>
                                        ) : (
                                            <p className="text-xl font-bold italic opacity-50">???</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={togglePlay}
                                            className="p-4 bg-[#1DB954] text-black rounded-full shadow-lg transition-all hover:scale-110"
                                        >
                                            {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
                                        </button>

                                        <button onClick={() => setIsRevealed(!isRevealed)} className="p-4 bg-yellow-400 text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                            {isRevealed ? <EyeOff size={32} /> : <Eye size={32} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-white/50 mt-2">Powered by Spotify Premium</p>
                                </>
                            ) : (
                                <div className="h-64 flex items-center justify-center opacity-50">
                                    <p>{deviceId ? "Ready to play" : "Connecting to Spotify..."}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Bingo Number Entry */}
                    <div className="flex flex-col items-center justify-center bg-black/20 p-6 rounded-3xl backdrop-blur-md">
                        <h3 className="text-2xl font-bold mb-6 text-center">Winner's Choice</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="1"
                                max="75"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="#"
                                className="w-40 h-40 text-8xl font-black text-center text-black rounded-3xl border-8 border-white focus:outline-none focus:ring-8 focus:ring-[#1DB954]/50 shadow-xl"
                            />
                            <button type="submit" className="w-full py-4 bg-black text-white text-2xl font-bold rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl transform hover:scale-105 active:scale-95">
                                <Check size={32} /> OPEN NUMBER
                            </button>
                        </form>
                    </div>

                </div>

            </div>

            <button onClick={onBack} className={`absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-black/20 hover:bg-black/40 rounded-full text-lg font-bold transition-all backdrop-blur-md z-50 ${isFullScreen ? 'hidden' : ''}`}>
                <ArrowLeft size={24} /> Back
            </button>
        </div>
    );
};
export default IntroQuizMode;

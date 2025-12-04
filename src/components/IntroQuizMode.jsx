import { ArrowLeft, Check, Music, Search, Play, Pause, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchDeezer } from '../utils/deezer';

const IntroQuizMode = ({ onBack, onRegister }) => {
    const [number, setNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.src = "";
            }
        };
    }, [audio]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        try {
            const tracks = await searchDeezer(searchQuery);
            setSearchResults(tracks);
            setShowResults(true);
        } catch (error) {
            console.error("Deezer search failed", error);
            alert("Search failed. Please try again.");
        }
    };

    const handleRandomPlay = async () => {
        // List of artists to rotate through
        const artists = [
            "Mrs. GREEN APPLE",
            "RADWIMPS",
            "ONE OK ROCK",
            "Vaundy",
            "YOASOBI",
            "Aimyon",
            "Chanmina",
            "BTS",
            "HANA",
            "aespa"
        ];

        // Pick one random artist
        const randomArtist = artists[Math.floor(Math.random() * artists.length)];
        const query = searchQuery || `artist:"${randomArtist}"`;

        try {
            // Fetch top tracks (RANKING order) strictly from the top (offset 0)
            let tracks = await searchDeezer(query, 100, 0, 'RANKING');

            // Retry logic: If no tracks found, try offset 0 (redundant here but safe)
            if (!tracks || tracks.length === 0) {
                console.log("No tracks found, retrying...");
                tracks = await searchDeezer(query, 100, 0);
            }

            if (tracks && tracks.length > 0) {
                // Filter for tracks with previews AND strictly match the artist name
                const playableTracks = tracks.filter(t => {
                    if (!t.preview) return false;

                    // If we are in random mode (no manual search query), strictly filter by artist
                    if (!searchQuery) {
                        return t.artist.name.toLowerCase().includes(randomArtist.toLowerCase());
                    }
                    return true;
                });

                if (playableTracks.length > 0) {
                    // Take the top 3 tracks
                    const top3 = playableTracks.slice(0, 3);

                    // Filter out currently playing track to ensure change
                    // If selectedTrack exists, remove it from candidates
                    const candidates = selectedTrack
                        ? top3.filter(t => t.id !== selectedTrack.id)
                        : top3;

                    // Fallback to top3 if candidates is empty (e.g. only 1 track total)
                    const pool = candidates.length > 0 ? candidates : top3;

                    // Pick one randomly from the pool
                    const randomTrack = pool[Math.floor(Math.random() * pool.length)];

                    // Update the search results to show these top 3
                    setSearchResults(top3);
                    setShowResults(true);

                    // Play the selected track
                    handlePlay(randomTrack);
                } else {
                    alert(`No playable tracks found for ${query}.`);
                }
            } else {
                alert(`No tracks found for ${query}.`);
            }
        } catch (error) {
            console.error("Random play failed", error);
            alert("Random play failed.");
        }
    };

    const handlePlay = (track) => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }

        if (track.preview) {
            const newAudio = new Audio(track.preview);
            newAudio.volume = 0.5;
            newAudio.onended = () => setIsPlaying(false);
            newAudio.play().catch(e => alert("Playback failed: " + e.message));

            setAudio(newAudio);
            setIsPlaying(true);
            setSelectedTrack(track);
            setIsRevealed(false);
            setShowResults(false);
        } else {
            alert("No preview available for this track.");
        }
    };

    const togglePlay = () => {
        if (audio) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (number) {
            onRegister(number);
            setNumber('');
            onBack();
        }
    };

    return (
        <div className="flex flex-col items-center h-screen w-full bg-[#1DB954] text-white relative overflow-hidden p-4">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-4 border-white rounded-full animate-ping [animation-duration:3s]"></div>
            </div>

            <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 h-full overflow-y-auto custom-scrollbar">

                {/* Header */}
                <div className="flex items-center gap-4 mt-8">
                    <div className="p-4 bg-black/20 rounded-full backdrop-blur-lg">
                        <Music size={40} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-display drop-shadow-lg">INTRO QUIZ</h1>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left: Search & Player */}
                    <div className="flex flex-col gap-6 bg-black/20 p-6 rounded-3xl backdrop-blur-md">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search song (Deezer)..."
                                className="flex-1 px-4 py-3 rounded-xl text-black font-bold focus:outline-none"
                            />
                            <button type="submit" className="p-3 bg-black rounded-xl hover:bg-gray-800 transition-colors">
                                <Search size={24} />
                            </button>
                        </form>

                        <button
                            onClick={handleRandomPlay}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
                        >
                            <Music size={20} /> Random Play (from Search or Pop)
                        </button>

                        {showResults && searchResults.length > 0 && (
                            <div className="bg-white/10 rounded-xl p-2 max-h-60 overflow-y-auto">
                                {searchResults.map(track => (
                                    <div key={track.id} onClick={() => handlePlay(track)} className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/20 cursor-pointer">
                                        <img src={track.album.cover_small} alt="" className="w-10 h-10 rounded" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate">{track.title}</p>
                                            <p className="text-xs opacity-80 truncate">{track.artist.name}</p>
                                        </div>
                                        <Play size={16} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Player Controls */}
                        <div className="flex flex-col items-center gap-4 mt-4 p-4 bg-black/40 rounded-2xl border border-white/10">
                            {selectedTrack ? (
                                <>
                                    <div className={`relative w-48 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isRevealed ? 'blur-0' : 'blur-md'}`}>
                                        <img src={selectedTrack.album.cover_medium} alt="Album Art" className="w-full h-full object-cover" />
                                    </div>

                                    <div className="text-center h-16 flex flex-col justify-center w-full px-4">
                                        {isRevealed ? (
                                            <>
                                                <p className="text-xl font-bold truncate w-full">{selectedTrack.title}</p>
                                                <p className="opacity-80 truncate w-full">{selectedTrack.artist.name}</p>
                                            </>
                                        ) : (
                                            <p className="text-xl font-bold italic opacity-50">???</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={togglePlay}
                                            className="p-4 bg-white text-black rounded-full shadow-lg transition-all hover:scale-110"
                                        >
                                            {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
                                        </button>

                                        <button onClick={() => setIsRevealed(!isRevealed)} className="p-4 bg-yellow-400 text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                            {isRevealed ? <EyeOff size={32} /> : <Eye size={32} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-white/50 mt-2">Powered by Deezer</p>
                                </>
                            ) : (
                                <div className="h-64 flex items-center justify-center opacity-50">
                                    <p>Select a track to play</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Bingo Number Entry */}
                    <div className="flex flex-col items-center justify-center bg-black/20 p-6 rounded-3xl backdrop-blur-md">
                        <h3 className="text-2xl font-bold mb-6 text-center">Winner's Choice</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
                            <input
                                type="number"
                                min="1"
                                max="75"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="#"
                                className="w-40 h-40 text-8xl font-black text-center text-black rounded-3xl border-8 border-white focus:outline-none focus:ring-8 focus:ring-black/20 shadow-xl"
                            />
                            <button type="submit" className="w-full py-4 bg-black text-white text-2xl font-bold rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl transform hover:scale-105 active:scale-95">
                                <Check size={32} /> OPEN NUMBER
                            </button>
                        </form>
                    </div>

                </div>

            </div>

            <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-black/20 hover:bg-black/40 rounded-full text-lg font-bold transition-all backdrop-blur-md z-50">
                <ArrowLeft size={24} /> Back
            </button>
        </div>
    );
};
export default IntroQuizMode;

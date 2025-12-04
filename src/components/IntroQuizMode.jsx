import { ArrowLeft, Check, Music, Search, Play, Pause, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loginUrl, getTokenFromUrl, searchTracks, playTrack } from '../utils/spotify';
import useSpotifyPlayer from '../hooks/useSpotifyPlayer';

const IntroQuizMode = ({ onBack, onRegister }) => {
    const [number, setNumber] = useState('');
    const [token, setToken] = useState(null);
    const [clientId, setClientId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const { player, deviceId, isPaused, isActive, currentTrack } = useSpotifyPlayer(token);

    useEffect(() => {
        const hash = getTokenFromUrl();
        const _token = hash.access_token;
        if (_token) {
            setToken(_token);
            window.location.hash = "";
            localStorage.setItem('spotify_token', _token);
        } else {
            const storedToken = localStorage.getItem('spotify_token');
            if (storedToken) setToken(storedToken);
        }
    }, []);

    const handleLogin = () => {
        if (!clientId) {
            alert("Please enter a Spotify Client ID");
            return;
        }
        window.location.href = loginUrl(clientId);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery || !token) return;
        const tracks = await searchTracks(searchQuery, token);
        setSearchResults(tracks);
        setShowResults(true);
    };

    const handlePlay = async (track) => {
        if (!deviceId) {
            alert("Player not ready. Please wait or refresh.");
            return;
        }
        await playTrack(token, deviceId, track.uri);
        setSelectedTrack(track);
        setIsRevealed(false);
        setShowResults(false);
    };

    const togglePlay = () => {
        if (player) player.togglePlay();
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

                {/* Spotify Auth / Controls */}
                {!token ? (
                    <div className="bg-black/40 p-8 rounded-2xl backdrop-blur-md flex flex-col gap-4 items-center">
                        <h2 className="text-2xl font-bold">Spotify Setup</h2>
                        <input
                            type="text"
                            placeholder="Client ID"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="px-4 py-2 rounded text-black w-64"
                        />
                        <button onClick={handleLogin} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform">
                            <LogIn size={20} /> Connect Spotify
                        </button>
                        <p className="text-xs opacity-70 max-w-xs text-center">Requires Spotify Premium and a Client ID from developer.spotify.com. Add http://localhost:5173/intro to Redirect URIs.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left: Search & Player */}
                        <div className="flex flex-col gap-6 bg-black/20 p-6 rounded-3xl backdrop-blur-md">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search song..."
                                    className="flex-1 px-4 py-3 rounded-xl text-black font-bold focus:outline-none"
                                />
                                <button type="submit" className="p-3 bg-black rounded-xl hover:bg-gray-800 transition-colors">
                                    <Search size={24} />
                                </button>
                            </form>

                            {showResults && searchResults.length > 0 && (
                                <div className="bg-white/10 rounded-xl p-2 max-h-60 overflow-y-auto">
                                    {searchResults.map(track => (
                                        <div key={track.id} onClick={() => handlePlay(track)} className="flex items-center gap-3 p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors">
                                            <img src={track.album.images[2].url} alt="" className="w-10 h-10 rounded" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold truncate">{track.name}</p>
                                                <p className="text-xs opacity-80 truncate">{track.artists[0].name}</p>
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
                                        <div className={`relative w-48 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isRevealed ? 'blur-0' : 'blur-xl grayscale'}`}>
                                            <img src={selectedTrack.album.images[0].url} alt="Album Art" className="w-full h-full object-cover" />
                                        </div>

                                        <div className="text-center h-16">
                                            {isRevealed ? (
                                                <>
                                                    <p className="text-xl font-bold truncate max-w-xs">{selectedTrack.name}</p>
                                                    <p className="opacity-80">{selectedTrack.artists[0].name}</p>
                                                </>
                                            ) : (
                                                <p className="text-xl font-bold italic opacity-50">???</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <button onClick={togglePlay} className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                                {isPaused ? <Play size={32} fill="black" /> : <Pause size={32} fill="black" />}
                                            </button>

                                            <button onClick={() => setIsRevealed(!isRevealed)} className="p-4 bg-yellow-400 text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                                {isRevealed ? <EyeOff size={32} /> : <Eye size={32} />}
                                            </button>
                                        </div>
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
                )}
            </div>

            <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-black/20 hover:bg-black/40 rounded-full text-lg font-bold transition-all backdrop-blur-md z-50">
                <ArrowLeft size={24} /> Back
            </button>
        </div>
    );
};
export default IntroQuizMode;

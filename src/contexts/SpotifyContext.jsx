
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getAccessToken, redirectToAuthCodeFlow } from '../utils/spotify';

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPaused, setIsPaused] = useState(true);
    const [isActive, setIsActive] = useState(false);

    // Auth Effect
    const effectRan = useRef(false);
    useEffect(() => {
        if (effectRan.current) return;

        const checkAuth = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            if (code) effectRan.current = true; // Mark as handled if processing code

            let _token = localStorage.getItem("spotify_access_token");

            if (code) {
                try {
                    _token = await getAccessToken(code);
                    localStorage.setItem("spotify_access_token", _token);
                    window.history.replaceState({}, null, window.location.pathname); // Keep current path
                    setToken(_token);
                } catch (e) {
                    console.error("Token exchange failed", e);
                }
            } else if (_token) {
                setToken(_token);
            }

            if (_token) {
                // Initialize Player
                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
                document.body.appendChild(script);

                window.onSpotifyWebPlaybackSDKReady = () => {
                    const newPlayer = new window.Spotify.Player({
                        name: 'Bingo Quiz Global Player',
                        getOAuthToken: cb => { cb(_token); },
                        volume: 0.5 // Default volume
                    });

                    newPlayer.addListener('ready', ({ device_id }) => {
                        console.log('Ready with Device ID', device_id);
                        setDeviceId(device_id);
                    });

                    newPlayer.addListener('not_ready', ({ device_id }) => {
                        console.log('Device ID has gone offline', device_id);
                    });

                    newPlayer.addListener('initialization_error', ({ message }) => {
                        console.error('Failed to initialize', message);
                    });

                    newPlayer.addListener('authentication_error', ({ message }) => {
                        console.error('Failed to authenticate', message);
                    });

                    newPlayer.addListener('account_error', ({ message }) => {
                        console.error('Failed to validate Spotify account', message);
                    });

                    newPlayer.addListener('playback_error', ({ message }) => {
                        console.error('Failed to perform playback', message);
                    });

                    newPlayer.addListener('player_state_changed', (state) => {
                        if (!state) return;
                        setIsPaused(state.paused);
                        setIsActive(true);
                    });

                    newPlayer.connect();
                    setPlayer(newPlayer);
                };
            }
        };

        checkAuth();
    }, []);

    const login = () => {
        redirectToAuthCodeFlow();
    };

    return (
        <SpotifyContext.Provider value={{ token, player, deviceId, isPaused, isActive, login }}>
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotify = () => useContext(SpotifyContext);

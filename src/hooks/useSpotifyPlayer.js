import { useState, useEffect } from 'react';

const useSpotifyPlayer = (token) => {
    const [player, setPlayer] = useState(undefined);
    const [deviceId, setDeviceId] = useState(null);
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        const initializePlayer = () => {
            const player = new window.Spotify.Player({
                name: 'Bingo Reunion Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error('Initialization Error:', message);
                setError(message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error('Authentication Error:', message);
                setError(message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error('Account Error:', message);
                setError("Premium Account Required");
            });

            player.addListener('playback_error', ({ message }) => {
                console.error('Playback Error:', message);
                setError(message);
            });

            player.addListener('player_state_changed', (state => {
                if (!state) return;
                setCurrentTrack(state.track_window.current_track);
                setPaused(state.paused);
                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });
            }));

            player.connect();
        };

        if (window.Spotify) {
            initializePlayer();
        } else {
            window.onSpotifyWebPlaybackSDKReady = initializePlayer;
            if (!document.getElementById('spotify-player-script')) {
                const script = document.createElement("script");
                script.id = 'spotify-player-script';
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
                document.body.appendChild(script);
            }
        }

        return () => {
            // We don't remove the script to avoid reloading issues
            if (player) player.disconnect();
        };
    }, [token]);

    return { player, deviceId, isPaused, isActive, currentTrack, error };
};

export default useSpotifyPlayer;

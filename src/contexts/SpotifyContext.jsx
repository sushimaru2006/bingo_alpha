
// ⚠️ セキュリティ・Capacitor 互換性レビューメモ (2026-05-04)
//
// [送信データ確認]
// - spotify_access_token: localStorage に保存のみ。外部への不要送信なし。
// - verifier (PKCE): localStorage に一時保存。Spotify /api/token にのみ送信され、取得後は削除されない（要改善）。
//   改善案: getAccessToken 完了後に localStorage.removeItem("verifier") を呼ぶこと。
//
// [Capacitor (WKWebView) 互換性]
// - Spotify Web Playback SDK (sdk.scdn.co/spotify-player.js) は Web ブラウザ専用 SDK。
//   WKWebView 上での動作は非サポート。Capacitor ネイティブアプリでは SDK が機能しない可能性が高い。
//   代替案: Spotify iOS SDK (native) の使用、または再生機能を省略して楽曲検索・メタデータ表示のみに絞る。
//
// [アクセストークンの保管]
// - localStorage は iOS でストレージ圧迫時にクリアされる可能性がある。
//   Capacitor ネイティブアプリでは @capacitor/preferences (iOS Keychain 使用) への移行を推奨。

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

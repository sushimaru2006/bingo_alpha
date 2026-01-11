
// Access Token & Config
const CLIENT_ID = "bb3c0fe8133744a0a514a3d27cc469fa";
const REDIRECT_URI = "http://127.0.0.1:5173/intro";
const SCOPES = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-modify-playback-state"
];

// PKCE Helper Functions
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

// 1. Redirect user to Spotify Login Page
export const redirectToAuthCodeFlow = async () => {
    const verifier = generateRandomString(128);
    // Store verifier locally for the callback step
    localStorage.setItem("verifier", verifier);

    const hashed = await sha256(verifier);
    const codeChallenge = base64encode(hashed);

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", REDIRECT_URI);
    params.append("scope", SCOPES.join(" "));
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", codeChallenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// 2. Exchange Authorization Code for Access Token
export const getAccessToken = async (code) => {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const data = await result.json();
    return data.access_token;
};

// API Functions
export const searchSpotify = async (query, token) => {
    if (!token) throw new Error("No token provided");

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Spotify search failed");
    }

    const data = await response.json();
    return data.tracks.items;
};

export const playSpotifyTrack = async (token, device_id, track_uri, position_ms = 0) => {
    if (!token || !device_id) return;

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            uris: [track_uri],
            position_ms: position_ms
        })
    });
};

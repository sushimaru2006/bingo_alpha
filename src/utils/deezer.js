// ⚠️ Capacitor (WKWebView) 互換性に関する注意
// 現在の実装は JSONP（動的 <script> タグ注入）を使用している。
// WKWebView では Content Security Policy により script-src が制限される場合があり、
// JSONP が動作しない可能性がある。
//
// 【代替案】Capacitor ネイティブアプリでは以下のいずれかに変更すること:
//   1. CORS 対応のバックエンドプロキシ経由で fetch を使用する
//      例: `/api/deezer?q=...` → サーバーサイドで Deezer API を呼び出す
//   2. Deezer の公式 SDK に移行する（現状 JSONP のみ公式サポート）
//   3. Deezer API の使用を廃止し、Spotify Search API に統一する（現状 Spotify は既に使用済み）
//
// 現時点では Web ブラウザ環境でのみ動作を保証する。
// Capacitor ビルド後に動作確認が必要。

export const searchDeezer = async (query, limit = 50, index = 0, order = 'RANKING') => {
    return new Promise((resolve, reject) => {
        // Unique callback name for JSONP
        const callbackName = 'deezerCallback_' + Math.round(100000 * Math.random());

        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            if (data.error) {
                reject(new Error(data.error.message));
            } else {
                resolve(data.data);
            }
        };

        const script = document.createElement('script');
        // Use 'track' type implicitly by searching everything or specify type if needed.
        // Deezer search endpoint searches tracks by default.
        script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}&index=${index}&order=${order}&output=jsonp&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('Deezer API request failed'));
        };
        document.body.appendChild(script);
    });
};

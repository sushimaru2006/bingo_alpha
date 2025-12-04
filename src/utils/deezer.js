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

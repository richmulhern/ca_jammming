let accessToken = null;
let expiresIn = 0;
const clientId = '11ea994e396c4fccbc5fc95c15f8b3a7';
const redirectURI = 'http://rmulhern.surge.sh';

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        if(accessToken = window.location.href.match(/access_token=([^&]*)/)) {
            accessToken = accessToken[1];

            const expiresArray = window.location.href.match(/expires_in=([^&]*)/);
            expiresIn = expiresArray[1];

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        }

        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization:  `Bearer ${this.getAccessToken()}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.total === 0) {
                return [];
            }

            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name
                };
            });

        })
    },

    savePlaylist(name, tracks) {
        if (!name || !tracks) {
            return;
        }

        const accessToken = this.getAccessToken();
        const headers = {
            Authorization:  `Bearer ${accessToken}`,
            "Content-Type": 'application/json'
        };
        let userID = null;
        let playlistID = null;

        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(jsonResponse => {
            userID = jsonResponse.id;

            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: name})
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).then(jsonResponse => {
                playlistID = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({uris: tracks})
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(jsonResponse => {
                    return jsonResponse;
                });
            });
        });




    }
}

require("dotenv").config();
const axios=require("axios");
const clientId=process.env.SPOTIFYCLIENTID
const clientSecret=process.env.SPOTIFYCLIENTSECRET
// const clientId=process.env.SPOTIFYCLIENTID
// const clientSecret=process.env.SPOTIFYCLIENTSECRET
async function getAccessToken() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: 'client_credentials',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
        });

        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to retrieve access token');
    }
}

async function getPlaylistTracks(accessToken,playlistId) {
    try {
        let tracks = [];
        let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        while (nextUrl) {
            const response = await axios({
                method: 'get',
                url: nextUrl,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            tracks = [...tracks, ...response.data.items];
            nextUrl = response.data.next;
        }
        const jsonResponse = tracks.map((track, index) => ({
            name: track.track.name,
            artist: track.track.artists.map((artist) => artist.name),
            url: track.track.external_urls.spotify,
          }));
        return jsonResponse;
    } catch (error) {
        throw new Error('Failed to retrieve playlist tracks');
    }
}


module.exports={getAccessToken,getPlaylistTracks}
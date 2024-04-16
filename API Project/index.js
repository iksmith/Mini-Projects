import express from 'express';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import querystring from "querystring";
import { access } from 'fs';


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));

//rendering home page
// app.get('/', (req, res) => {
//     res.render('index.ejs');
// })



// Spotify API
const clientID = '72b036c833ea471087f2ff0a3eb44d31';
const clientSecret = '111247304fbf44af8d15a2d1634e7386';
const redirectUri = 'http://localhost:3000/callback';

// Request Authorization; The user logs in to authorize access/gives token
const getAuthorizationCode = () => {
    const scope = 'user-read-private user-read-email';
    const url = 'https://accounts.spotify.com/authorize?' + 
    'response_type=code' + 
    '&client_id=' + clientID + 
    (scope ? '&scope=' + encodeURIComponent(scope) : '') + 
    '&redirect_uri=' + encodeURIComponent(redirectUri);
    // console.log(url);
    return url; // return url

};

// Spotify to return Auth & refresh app w/token
const getAccessToken = async (code) => {
    const authOptions = {
        method: 'post', 
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
        }),
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json:true
    };
    try {
        const response = await axios(authOptions);
        return response.data;
    } catch (error) {
        console.log('Error retrieving Access Token', error);
    }
};

// function to randomize Drake songs
const searchTracks = async (accessToken, artistName, trackNames) => {
    const tracks = [];
  
    for (const trackName of trackNames) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=track:${trackName}%20artist:${artistName}&type=track`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        });
  
        tracks.push(response.data.tracks.items[0]); // Add the first track found to the array
      } catch (error) {
        console.error(`Error searching for track "${trackName}"`, error);
      }
    }
  
    return tracks;
};


app.get('/', (req, res) => {
    res.render('index', { track: [] });
})

app.get('/login', (req, res) => {
    const authorizationUrl = getAuthorizationCode();
    res.redirect(authorizationUrl);
});


app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;

    const spotifyAccessToken = await getAccessToken(authorizationCode);
    console.log('Access Token:', spotifyAccessToken);

    const drakeSongs = ['Chicago Freestyle', 'First Person Shooter', 'Jimmy Cooks', 'Fair Trade', 'Polar Opposites'];
    const tracks = await searchTracks(spotifyAccessToken.access_token, 'Drake', drakeSongs);
    console.log('Track:', tracks);

    res.render('index', { track : tracks });
});




// Port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
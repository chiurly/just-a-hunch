import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import Datastore from 'nedb';

import viewsRouter from './routes/views.js';
import channelsRouter from './routes/channels.js';
import apiChannelsRouter from './routes/api/channels.js';
import apiTwitchRouter from './routes/api/twitch.js';
import apiScoresRouter from './routes/api/scores.js';

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export const database = {
    channels: new Datastore('./database/channels.db'),
    scores: {
        views: new Datastore('./database/scores/views.db')
    }
}

export let twitchAccessToken;

function createTwitchAccessToken() {
    return new Promise(async function (resolve, reject) {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
        const options = { method: "POST" }
        const response = await fetch(url, options);

        if (response.status >= 400) {
            reject(console.error('Could not create a Twitch access token'));
        }

        const json = await response.json();
        resolve(json.access_token);
    });
}

database.channels.loadDatabase(function (error) {
    if (error) {
        console.error(error);
    }
});

database.scores.views.loadDatabase(function (error) {
    if (error) {
        console.error(error);
    }
});

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/views', viewsRouter);
app.use('/channels', channelsRouter);
app.use('/api/channels', apiChannelsRouter);
app.use('/api/twitch', apiTwitchRouter);
app.use('/api/scores', apiScoresRouter);

app.get('/', function (request, response) {
    response.redirect(request.baseUrl + '/views/');
});

(async function () {
    twitchAccessToken = await createTwitchAccessToken();
    console.log(twitchAccessToken);

    app.listen(PORT, function () {
        console.log('http://localhost:' + PORT);
    });
})();
import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

import { twitchAccessToken } from '../../server.js';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

const router = express.Router();

router.get('/users', async function (request, response) {
    if (request.query.id == null && request.query.login == null) {
        response.status(400).json({ message: `Missing 'id' or 'login' query parameters` });
    }

    const queryParams = request.url.substring(request.url.indexOf('?'));
    const url = 'https://api.twitch.tv/helix/users' + queryParams;
    const options = {
        headers: {
            'Authorization': 'Bearer ' + twitchAccessToken,
            'Client-Id': CLIENT_ID
        }
    }

    const twitchResponse = await fetch(url, options);
    const twitchJson = await twitchResponse.json();

    if (twitchResponse.status >= 400) {
        twitchJson.message = 'Failed to get Twitch user info: ' + twitchJson.message
        response.status(twitchResponse.status).json(twitchJson);
    } else {
        response.json(twitchJson.data);
    }
});

export default router;
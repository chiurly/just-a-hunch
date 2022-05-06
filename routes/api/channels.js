import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

import { database } from '../../server.js';
import { twitchAccessToken } from '../../server.js';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

const router = express.Router();

router.get('/', function (request, response) {
    database.channels.find({}, function (error, documents) {
        if (error) {
            console.error(error);
            response.status(500).json({ message: 'Database failure' });
        } else {
            response.json(documents);
        }
    });
});

router.post('/:id', function (request, response) {
    const channelId = request.params.id;

    if (!channelId || isNaN(channelId)) {
        return response.status(400).json({ message: `Invalid route parameter 'id'` });
    }

    database.channels.findOne({ _id: channelId }, async function (error, document) {
        if (error) {
            console.error(error);
            return response.status(500).json({ message: 'Database failure' });
        }
        if (document) {
            return response.status(409).json({ message: `Channel ID '${channelId}' is already added` });
        }

        const url = 'https://api.twitch.tv/helix/users?id=' + channelId;
        const options = {
            headers: {
                'Authorization': 'Bearer ' + twitchAccessToken,
                'Client-Id': CLIENT_ID
            }
        }

        const twitchResponse = await fetch(url, options);
        const twitchJson = await twitchResponse.json();

        if (twitchResponse.status >= 400) {
            return response.status(twitchResponse.status).json(twitchJson);
        }

        database.channels.insert({ _id: channelId }, function (error, newDoc) {
            if (error) {
                console.error(error);
                response.status(500).json({ message: 'Database failure' });
            } else {
                response.status(201).json(newDoc);
            }
        });
    });
});

router.delete('/:id', function (request, response) {
    const channelId = request.params.id;

    if (channelId == null || isNaN(channelId)) {
        return response.status(400).json({ message: `Invalid route parameter 'id'` });
    }

    database.channels.findOne({ _id: channelId }, function (error, document) {
        if (error) {
            console.error(error);
            return response.status(500).json({ message: 'Database failure' });
        }
        if (!document) {
            return response.status(404).json({ message: `Channel ID '${channelId}' not found` });
        }
        database.channels.remove({ _id: channelId }, {}, function (error) {
            if (error) {
                console.error(error);
                response.status(500).json({ message: 'Database failure' });
            } else {
                response.json({ message: `Channel ID '${channelId}' removed` });
            }
        });
    });
});

export default router;
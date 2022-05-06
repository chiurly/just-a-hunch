import express from 'express';

import { database } from '../../server.js';

const router = express.Router();

router.get('/views', function (request, response) {
    database.scores.views.find({}, function (error, data) {
        if (error) {
            console.error(error);
            response.status(500).json({ message: 'Database failure' });
        } else {
            response.json(data);
        }
    });
});

router.post('/views/:score', function (request, response) {
    const score = request.params.score;

    if (isNaN(score)) {
        return response.status(400).json({ message: `Invalid route parameter 'score'` });
    }

    database.scores.views.insert({ score }, function (error, newDoc) {
        if (error) {
            console.error(error);
            response.status(500).json({ message: 'Database failure' });
        } else {
            response.json(newDoc);
        }
    });
});

export default router;
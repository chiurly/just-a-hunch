import express from 'express';

const router = express.Router();

router.get('/', function (request, response) {
    response.sendFile('public/channels/channels.html', { root: '.' });
});

export default router;
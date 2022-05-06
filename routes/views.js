import express from 'express';

const router = express.Router();

router.get('/', function (request, response) {
    response.sendFile('public/views/views.html', { root: '.' });
});

export default router;
# Just a Hunch

Just a Hunch is a [Node.js](https://nodejs.org/en/) web app game where the user guesses which [Twitch](https://www.twitch.tv/) channel has a greater total view count.

## Getting started

First, install dependencies with `npm install`

Next, in the root directory create a file named ".env" containing:
```
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

- `TWITCH_CLIENT_ID` - is the ID of your registered application. You can register a new application at https://dev.twitch.tv/console
- `TWITCH_CLIENT_SECRET` - is a private secret key generated when you register an application

Finally, start the server with `npm start`

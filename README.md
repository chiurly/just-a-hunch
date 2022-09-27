# Just a Hunch

Just a Hunch is a [Node.js](https://nodejs.org/en/) browser game where the user guesses which [Twitch](https://www.twitch.tv/) channel has a greater total view count.

## Installation

Install dependencies by enetring the `npm install` CLI command.

Next, create a ".env" file in the root directory containing:
```
TWITCH_CLIENT_ID=<your_twitch_client_id>
TWITCH_CLIENT_SECRET=<your_twitch_client_secret>
```

- `TWITCH_CLIENT_ID` - This is the Client ID of your registered application. You can register a new application at https://dev.twitch.tv/console
- `TWITCH_CLIENT_SECRET` - This is the secret generated for you when you register your application, do not share this.

Finally, entering the `npm start` CLI command should start the server.

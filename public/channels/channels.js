const channelsTextArea = document.getElementById('channels');
const channelNameField = document.getElementById('channelName');
const addChannelButton = document.getElementById('addChannel');
const removeChannelButton = document.getElementById('removeChannel');
const resultLabel = document.getElementById('result');

async function loadChannels() {
    const response = await fetch('/api/channels');
    const channels = await response.json();

    let queryParams = '';
    let first = true;

    for (const channel of channels) {
        if (first) {
            queryParams = '?id=' + channel._id;
            first = false;
        } else {
            queryParams += '&id=' + channel._id;
        }
    }

    const twitchResponse = await fetch('/api/twitch/users' + queryParams);
    const twitchChannels = await twitchResponse.json();

    let channelsText = '';
    first = true;

    for (const channel of twitchChannels) {
        if (first) {
            channelsText += channel.display_name;
            first = false;
        } else {
            channelsText += '\n' + channel.display_name;
        }
    };

    channelsTextArea.textContent = channelsText;
}

async function onAddChannelClick() {
    const channelName = channelNameField.value.trim();

    if (channelName.length == 0) {
        return;
    }

    const twitchResponse = await fetch('/api/twitch/users?login=' + channelName);
    const twitchJson = await twitchResponse.json();
    const channelId = twitchJson[0].id;

    const url = '/api/channels/' + channelId;
    const options = { method: 'POST' }
    const response = await fetch(url, options);
    const json = await response.json();

    resultLabel.textContent = json.message || `Channel ID '${channelId}' added`;
    loadChannels();
}

async function onRemoveChannelClick() {
    const channelName = channelNameField.value.trim();

    if (channelName.length == 0) {
        return;
    }

    const twitchResponse = await fetch('/api/twitch/users?login=' + channelName);
    const twitchJson = await twitchResponse.json();
    const channelId = twitchJson[0].id;

    const url = '/api/channels/' + channelId;
    const options = { method: 'DELETE' }
    const response = await fetch(url, options);
    const json = await response.json();

    resultLabel.textContent = json.message;
    loadChannels();
}

loadChannels();
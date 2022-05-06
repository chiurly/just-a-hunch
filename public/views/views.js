const scoreText = document.getElementById('score');
const restartButton = document.getElementById('restart');

const leftChannelImage = document.getElementById('leftChannelImage');
const leftChannelName = document.getElementById('leftChannelName');
const leftChannelViews = document.getElementById('leftChannelViews');

const rightChannelImage = document.getElementById('rightChannelImage');
const rightChannelName = document.getElementById('rightChannelName');
const rightChannelViews = document.getElementById('rightChannelViews');

const statsContext = document.getElementById('statsChart').getContext('2d');

let score = 0;
let clickDebounce = false;
let twitchChannels = [];
let leftChannel;
let rightChannel;

async function init() {
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
    twitchChannels = await twitchResponse.json();

    rightChannel = getRandomChannel();
    loadChannel();

    loadStats();
}

async function loadStats() {
    let labels = [];
    const scoresResponse = await fetch('/api/scores/views');
    const scores = await scoresResponse.json();
    let amounts = [];

    for (const scoreObj of scores) {
        const score = scoreObj.score;
        if (isNaN(amounts[score])) {
            amounts[score] = 0;
        }
        amounts[score]++;
    }

    for (let i = 0; i < amounts.length; i++) {
        if (isNaN(amounts[i])) {
            amounts[i] = 0;
        }
        labels.push(i.toString());
    }

    const config = {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: amounts,
                fill: 'start',
                backgroundColor: 'hsla(0, 50%, 50%, 0.25)',
                borderColor: 'hsla(0, 50%, 50%, 0.5)',
                tension: 1 / 3
            }]
        },
        options: {
            scales: {
                yAxis: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }

    const statsChart = new Chart(statsContext, config);
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function animateCounter(element, endNum, duration) {
    return new Promise(function (resolve, reject) {
        const startTime = Date.now();
        const endTime = startTime + duration;
        let currentTime = startTime;

        const interval = setInterval(function () {
            const progress = (currentTime - startTime) / (endTime - startTime);
            const currentNum = Math.floor(easeOutCubic(progress) * endNum);
            element.textContent = currentNum.toLocaleString('en-US');
            currentTime = Date.now();
        }, duration / 100);

        setTimeout(function () {
            clearInterval(interval);
            element.textContent = endNum.toLocaleString('en-US');
            resolve();
        }, duration);
    });
}

function getRandomChannel(ignoreId) {
    let randomChannel;
    do {
        const randomIndex = Math.floor(Math.random() * twitchChannels.length);
        randomChannel = twitchChannels[randomIndex];
    } while (ignoreId && ignoreId == randomChannel.id);

    return randomChannel;
}

function loadChannel() {
    leftChannel = rightChannel;
    rightChannel = getRandomChannel(leftChannel.id);

    leftChannelImage.style.background = `url("${leftChannel.profile_image_url}")`;
    leftChannelImage.style.backgroundSize = 'cover';
    leftChannelName.textContent = leftChannel.display_name;
    leftChannelViews.textContent = leftChannel.view_count.toLocaleString('en-US');

    rightChannelImage.style.background = `url("${rightChannel.profile_image_url}")`;
    rightChannelImage.style.backgroundSize = 'cover';
    rightChannelName.textContent = rightChannel.display_name;
    rightChannelViews.textContent = '?';
}

function winOrLose(leftOrRight, leftViews, rightViews) {
    let win = false;
    let tie = false;

    if (leftViews == rightViews) {
        tie = true;
    } else if (leftOrRight == 'left' && leftViews > rightViews) {
        win = true
    } else if (leftOrRight == 'right' && rightViews > leftViews) {
        win = true
    }

    return { win, tie };
}

async function onChannelClick(leftOrRight) {
    if (clickDebounce) {
        return;
    }

    clickDebounce = true;
    const leftViews = leftChannel.view_count;
    const rightViews = rightChannel.view_count;
    const result = winOrLose(leftOrRight, leftViews, rightViews);
    await animateCounter(rightChannelViews, parseInt(rightViews), 500);

    if (result.win == false) {
        restartButton.style.display = 'inline-block';
        fetch('/api/scores/views/' + score, { method: 'POST' });
        return;
    }
    if (result.win) {
        score++;
        scoreText.textContent = score;
    }

    setTimeout(function () {
        loadChannel();
        clickDebounce = false;
    }, 1000);
}

function onRestartClick() {
    restartButton.style.display = 'none';
    score = 0;
    scoreText.textContent = score;
    loadChannel();
    clickDebounce = false;
}

init();
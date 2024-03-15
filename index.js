const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

const instagramAPIEndpoint = 'YOUR_INSTAGRAM_API_ENDPOINT';

async function fetchInstagramData() {
    try {
        const response = await axios.get(instagramAPIEndpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        return null;
    }
}

function sendInstagramData(chatId, data) {
    if (data) {
        bot.sendMessage(chatId, 'Here is the latest Instagram data: ' + JSON.stringify(data));
    } else {
        bot.sendMessage(chatId, 'Failed to fetch Instagram data. Please try again later.');
    }
}

function sendWelcomeMessage(chatId) {
    bot.sendMessage(chatId, 'Welcome to the Instagram Telegram Bot. Use /instagram to get the latest Instagram data.');
}

function sendHelpMessage(chatId) {
    bot.sendMessage(chatId, 'Commands:\n/instagram - Get the latest Instagram data\n/help - Show this help message');
}

function handleUnsupportedCommand(chatId) {
    bot.sendMessage(chatId, 'Unsupported command. Use /help to see available commands.');
}

bot.onText(/\/instagram/, async (msg) => {
    const chatId = msg.chat.id;
    const instagramData = await fetchInstagramData();
    sendInstagramData(chatId, instagramData);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    sendWelcomeMessage(chatId);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    sendHelpMessage(chatId);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    handleUnsupportedCommand(chatId);
});

setInterval(async () => {
    const instagramData = await fetchInstagramData();
    if (instagramData) {
        console.log('Instagram data:', instagramData);
    } else {
        console.error('Failed to fetch Instagram data.');
    }
}, 3600000);

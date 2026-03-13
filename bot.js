const TelegramBot = require('node-telegram-bot-api');
const createServerCommand = require('./commands/createServer');
const menuCommand = require('./commands/menu');
const listUsersCommand = require('./commands/listUsers');
const listServersCommand = require('./commands/listServers');
const delUserCommand = require('./commands/delUser');
const delServerCommand = require('./commands/delServer');
const statusMenuCommand = require('./commands/start');
const cadminPanelCommand = require('./commands/cadminpanel');
const listPanelAdminsCommand = require('./commands/listpaneladmins');
const createUserCommand = require('./commands/createuser');
const addServerCommand = require('./commands/addserver');

const { TELEGRAM_TOKEN, AUTHORIZED_ADMINS } = require('./config');

// Initialize bot with polling (your original method)
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Register commands
menuCommand(bot, AUTHORIZED_ADMINS);
createServerCommand(bot, AUTHORIZED_ADMINS);
listUsersCommand(bot, AUTHORIZED_ADMINS);
listServersCommand(bot, AUTHORIZED_ADMINS);
delUserCommand(bot, AUTHORIZED_ADMINS);
delServerCommand(bot, AUTHORIZED_ADMINS);
statusMenuCommand(bot, AUTHORIZED_ADMINS);
cadminPanelCommand(bot, AUTHORIZED_ADMINS);
listPanelAdminsCommand(bot, AUTHORIZED_ADMINS);
createUserCommand(bot, AUTHORIZED_ADMINS);
addServerCommand(bot, AUTHORIZED_ADMINS);

// Get bot info
bot.getMe().then((me) => {
    console.log(`✅ Telegram bot @${me.username} is running...`);
}).catch((err) => {
    console.error('❌ Failed to get bot info:', err);
});

// Your existing polling error handler
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// ===== MINIMAL FIX FOR RENDER =====
// Add this HTTP server to satisfy Render's port requirement
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('🤖 Bot is running!');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Health check server running on port ${PORT}`);
});
// ===== END OF FIX =====

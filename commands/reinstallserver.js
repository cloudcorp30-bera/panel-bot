const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function reinstallServerCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/reinstallserver (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        const idOrName = match[1].trim();

        try {
            const res = await fetch(`${PANEL_DOMAIN}/api/application/servers`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const data = await res.json();
            if (data.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(data.errors[0]));

            const server = data.data.find(s => s.attributes.id == idOrName || s.attributes.name === idOrName);
            if (!server) return bot.sendMessage(chatId, `❌ Server "${idOrName}" not found.`);

            const sid = server.attributes.id;
            const reinstallRes = await fetch(`${PANEL_DOMAIN}/api/application/servers/${sid}/reinstall`, {
                method: 'POST',
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });

            if (reinstallRes.status === 204) {
                bot.sendMessage(chatId, `🔄 Server *${server.attributes.name}* is being reinstalled.`, { parse_mode: 'Markdown' });
            } else {
                const err = await reinstallRes.json();
                bot.sendMessage(chatId, '❌ ' + JSON.stringify(err));
            }
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

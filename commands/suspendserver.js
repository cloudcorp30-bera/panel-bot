const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function suspendServerCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/suspendserver (.+)/, async (msg, match) => {
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
            const suspendRes = await fetch(`${PANEL_DOMAIN}/api/application/servers/${sid}/suspend`, {
                method: 'POST',
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });

            if (suspendRes.status === 204) {
                bot.sendMessage(chatId, `✅ Server *${server.attributes.name}* has been suspended.`, { parse_mode: 'Markdown' });
            } else {
                const err = await suspendRes.json();
                bot.sendMessage(chatId, '❌ ' + JSON.stringify(err));
            }
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

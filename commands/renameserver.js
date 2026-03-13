const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function renameServerCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/renameserver (\S+) (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        const idOrName = match[1].trim();
        const newName = match[2].trim();

        try {
            const res = await fetch(`${PANEL_DOMAIN}/api/application/servers`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const data = await res.json();
            if (data.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(data.errors[0]));

            const server = data.data.find(s => s.attributes.id == idOrName || s.attributes.name === idOrName);
            if (!server) return bot.sendMessage(chatId, `❌ Server "${idOrName}" not found.`);

            const sid = server.attributes.id;
            const attr = server.attributes;

            const updateRes = await fetch(`${PANEL_DOMAIN}/api/application/servers/${sid}/details`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + PANEL_API_KEY
                },
                body: JSON.stringify({
                    name: newName,
                    user: attr.user,
                    external_id: attr.external_id || null,
                    description: attr.description || ''
                })
            });

            const result = await updateRes.json();
            if (result.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(result.errors[0]));

            bot.sendMessage(chatId,
                `✅ Server renamed!\n\n🖥️ Old: *${attr.name}*\n🖥️ New: *${newName}*`,
                { parse_mode: 'Markdown' }
            );
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

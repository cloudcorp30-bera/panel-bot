const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function userInfoCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/userinfo (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        const usernameOrId = match[1].trim();

        try {
            const usersRes = await fetch(`${PANEL_DOMAIN}/api/application/users`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const usersData = await usersRes.json();
            if (usersData.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(usersData.errors[0]));

            const user = usersData.data.find(u =>
                u.attributes.username === usernameOrId || u.attributes.id == usernameOrId
            );
            if (!user) return bot.sendMessage(chatId, `❌ User "${usernameOrId}" not found.`);

            const u = user.attributes;

            const serversRes = await fetch(`${PANEL_DOMAIN}/api/application/servers`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const serversData = await serversRes.json();
            const userServers = serversData.data
                ? serversData.data.filter(s => s.attributes.user === u.id)
                : [];

            let serverList = userServers.length > 0
                ? userServers.map(s => `  • ${s.attributes.name} (ID: ${s.attributes.id})`).join('\n')
                : '  None';

            const text = `
👤 *User Info*

🆔 ID: *${u.id}*
👤 Username: *${u.username}*
📧 Email: *${u.email}*
🔤 Name: *${u.first_name} ${u.last_name}*
👑 Admin: *${u.root_admin ? 'Yes' : 'No'}*
🌐 2FA: *${u['2fa'] ? 'Enabled' : 'Disabled'}*
📅 Created: *${new Date(u.created_at).toLocaleDateString()}*

🖥️ Servers (${userServers.length}):
${serverList}
`;
            bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

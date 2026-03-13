const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function statsCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/stats/, async (msg) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        try {
            const [usersRes, serversRes, nodesRes] = await Promise.all([
                fetch(`${PANEL_DOMAIN}/api/application/users`, {
                    headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
                }),
                fetch(`${PANEL_DOMAIN}/api/application/servers`, {
                    headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
                }),
                fetch(`${PANEL_DOMAIN}/api/application/nodes`, {
                    headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
                })
            ]);

            const [usersData, serversData, nodesData] = await Promise.all([
                usersRes.json(), serversRes.json(), nodesRes.json()
            ]);

            const totalUsers   = usersData.data ? usersData.data.length : '?';
            const adminUsers   = usersData.data ? usersData.data.filter(u => u.attributes.root_admin).length : '?';
            const totalServers = serversData.data ? serversData.data.length : '?';
            const suspended    = serversData.data ? serversData.data.filter(s => s.attributes.suspended).length : '?';
            const totalNodes   = nodesData.data ? nodesData.data.length : '?';

            const text = `
📊 *Panel Statistics*

👥 Users: *${totalUsers}* (${adminUsers} admins)
🖥️ Servers: *${totalServers}* (${suspended} suspended)
🌐 Nodes: *${totalNodes}*
🔗 Panel: ${PANEL_DOMAIN}
`;
            bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

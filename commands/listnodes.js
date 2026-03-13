const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function listNodesCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/listnodes/, async (msg) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        try {
            const res = await fetch(`${PANEL_DOMAIN}/api/application/nodes`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const data = await res.json();
            if (data.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(data.errors[0]));

            const nodes = data.data;
            if (!nodes || nodes.length === 0) return bot.sendMessage(chatId, '⚠ No nodes found.');

            let text = '🌐 *Nodes List*\n\n';
            nodes.forEach((node, i) => {
                const n = node.attributes;
                const ramUsed  = Math.round(n.allocated_resources ? n.allocated_resources.memory / 1024 : 0);
                const ramTotal = Math.round(n.memory / 1024);
                const diskUsed = Math.round(n.allocated_resources ? n.allocated_resources.disk / 1024 : 0);
                const diskTotal = Math.round(n.disk / 1024);
                text += `*${i + 1}. ${n.name}*\n`;
                text += `🆔 ID: ${n.id}\n`;
                text += `🌍 Location: ${n.location_id}\n`;
                text += `🖥️ FQDN: ${n.fqdn}\n`;
                text += `💾 RAM: ${ramUsed}GB / ${ramTotal}GB\n`;
                text += `💿 Disk: ${diskUsed}GB / ${diskTotal}GB\n`;
                text += `🔒 SSL: ${n.scheme === 'https' ? 'Yes' : 'No'}\n`;
                text += `───────────────\n`;
            });

            bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

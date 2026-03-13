const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function listAllocationsCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/listallocations/, async (msg) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        try {
            const nodesRes = await fetch(`${PANEL_DOMAIN}/api/application/nodes`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const nodesData = await nodesRes.json();
            if (nodesData.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(nodesData.errors[0]));

            const nodes = nodesData.data;
            if (!nodes || nodes.length === 0) return bot.sendMessage(chatId, '⚠ No nodes found.');

            let text = '📡 *Allocations by Node*\n\n';

            for (const node of nodes) {
                const nid = node.attributes.id;
                const nname = node.attributes.name;

                const allocRes = await fetch(`${PANEL_DOMAIN}/api/application/nodes/${nid}/allocations`, {
                    headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
                });
                const allocData = await allocRes.json();
                if (allocData.errors) continue;

                const allocs = allocData.data || [];
                const free   = allocs.filter(a => !a.attributes.assigned);
                const used   = allocs.filter(a =>  a.attributes.assigned);

                text += `🌐 *${nname}* (Node ${nid})\n`;
                text += `✅ Free: ${free.length} | 🔴 Used: ${used.length} | Total: ${allocs.length}\n`;

                if (free.length > 0) {
                    const preview = free.slice(0, 5).map(a => `${a.attributes.ip}:${a.attributes.port}`).join(', ');
                    text += `Free IPs: ${preview}${free.length > 5 ? ` (+${free.length - 5} more)` : ''}\n`;
                }
                text += `───────────────\n`;
            }

            bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

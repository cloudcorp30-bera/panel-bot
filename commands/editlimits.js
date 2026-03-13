const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

function parseMB(val) {
    if (!val || val === 'unlimited' || val === 'unli' || val === '0') return 0;
    if (val.endsWith('gb')) return parseInt(val) * 1024;
    if (val.endsWith('mb')) return parseInt(val);
    return parseInt(val);
}

module.exports = function editLimitsCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/editlimits (\S+) (\S+) (\S+) (\S+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        const idOrName = match[1].trim();
        const ramRaw   = match[2].trim();
        const cpuRaw   = match[3].trim();
        const diskRaw  = match[4].trim();

        const memory = parseMB(ramRaw);
        const cpu    = (cpuRaw === 'unlimited' || cpuRaw === 'unli') ? 0 : parseInt(cpuRaw);
        const disk   = parseMB(diskRaw);

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

            const updateRes = await fetch(`${PANEL_DOMAIN}/api/application/servers/${sid}/build`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + PANEL_API_KEY
                },
                body: JSON.stringify({
                    allocation: attr.allocation,
                    memory,
                    swap: attr.limits.swap,
                    disk,
                    io: attr.limits.io,
                    cpu,
                    threads: null,
                    feature_limits: attr.feature_limits
                })
            });

            const result = await updateRes.json();
            if (result.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(result.errors[0]));

            bot.sendMessage(chatId,
                `✅ *Limits Updated for ${server.attributes.name}*\n\n💾 RAM: *${memory === 0 ? 'Unlimited' : memory + ' MB'}*\n⚙️ CPU: *${cpu === 0 ? 'Unlimited' : cpu + '%'}*\n💿 Disk: *${disk === 0 ? 'Unlimited' : disk + ' MB'}*`,
                { parse_mode: 'Markdown' }
            );
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

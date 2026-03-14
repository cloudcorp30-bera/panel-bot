const bp = require('../brucepanel-api');

const STATUS_EMOJI = { running: '🟢', stopped: '⚪', error: '🔴', installing: '🟡', idle: '🔵' };

module.exports = function(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/bp_list/, async (msg) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        try {
            const projects = await bp.listProjects();
            if (!projects.length) return bot.sendMessage(chatId, '📦 No BrucePanel projects yet.\n\nUse /bp_new to create one.');

            let text = `🚀 *BrucePanel Projects* (${projects.length})\n\n`;
            for (const p of projects) {
                const emoji = STATUS_EMOJI[p.status] || '⚫';
                text += `${emoji} *${p.name}*\n`;
                text += `   ID: \`${p.id.slice(0, 8)}...\`\n`;
                text += `   Status: ${p.status}`;
                if (p.uptime) text += ` (${p.uptime})`;
                text += `\n   Cmd: \`${p.startCommand}\`\n\n`;
            }
            text += `Use /bp_logs <id> for logs, /bp_start <id> to start, etc.`;
            bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });
};

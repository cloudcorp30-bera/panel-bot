const bp = require('../brucepanel-api');

const STATUS_EMOJI = { running: '🟢', stopped: '⚪', error: '🔴', installing: '🟡', idle: '🔵' };

module.exports = function(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/bp_status (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        const id = match[1].trim();
        try {
            const p = await bp.getProject(id);
            const emoji = STATUS_EMOJI[p.status] || '⚫';
            let text = `${emoji} *${p.name}*\n\n`;
            text += `Status: *${p.status}*\n`;
            if (p.uptime) text += `Uptime: ${p.uptime}\n`;
            text += `Command: \`${p.startCommand}\`\n`;
            if (p.githubUrl) text += `GitHub: ${p.githubUrl}\n`;
            text += `Created: ${new Date(p.createdAt).toLocaleDateString()}\n\n`;
            text += `Actions:\n`;
            text += p.status === 'running'
                ? `/bp_stop ${p.id}\n/bp_restart ${p.id}\n`
                : `/bp_start ${p.id}\n`;
            text += `/bp_logs ${p.id}\n/bp_deploy ${p.id}`;
            bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });
};

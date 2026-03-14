const bp = require('../brucepanel-api');

module.exports = function(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/bp_logs (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        const id = match[1].trim();
        try {
            const [project, logsData] = await Promise.all([bp.getProject(id), bp.getLogs(id)]);
            const logs = logsData.logs;
            const lastLogs = logs.slice(-25).join('\n');
            const text = `📋 *${project.name}* — Logs (last ${Math.min(25, logs.length)} lines)\nStatus: ${project.status}\n\n\`\`\`\n${lastLogs || 'No logs yet.'}\n\`\`\``;
            // Telegram has 4096 char limit
            if (text.length > 4000) {
                const short = lastLogs.slice(-3000);
                bot.sendMessage(chatId, `📋 *${project.name}* — Recent Logs\n\n\`\`\`\n${short}\n\`\`\``, { parse_mode: 'Markdown' });
            } else {
                bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
            }
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });
};

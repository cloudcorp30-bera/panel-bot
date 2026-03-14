const bp = require('../brucepanel-api');

module.exports = function(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/bp_start (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        const id = match[1].trim();
        try {
            await bp.startProject(id);
            const project = await bp.getProject(id);
            bot.sendMessage(chatId, `▶️ *${project.name}* started!\n\nStatus: ${project.status}\n/bp_logs ${id}`, { parse_mode: 'Markdown' });
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });
};

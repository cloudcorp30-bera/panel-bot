const bp = require('../brucepanel-api');

module.exports = function(bot, AUTHORIZED_ADMINS) {
    // /bp_deploy <id> [github_url]
    bot.onText(/\/bp_deploy (\S+)(?:\s+(.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        const id = match[1].trim();
        const githubUrl = match[2]?.trim() || '';
        try {
            const project = await bp.getProject(id);
            await bp.deployProject(id, githubUrl || project.githubUrl);
            bot.sendMessage(chatId,
                `🚀 *Deploying ${project.name}*...\n\n` +
                `GitHub: ${githubUrl || project.githubUrl || 'N/A'}\n` +
                `This clones the repo, installs deps & starts your project.\n\n` +
                `Watch logs:\n/bp_logs ${id}`,
                { parse_mode: 'Markdown' }
            );
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });
};

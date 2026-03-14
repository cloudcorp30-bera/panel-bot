const bp = require('../brucepanel-api');

module.exports = function(bot, AUTHORIZED_ADMINS) {
    // View env: /bp_env <id>
    // Set env:  /bp_env <id> KEY=VALUE KEY2=VALUE2
    bot.onText(/\/bp_env (\S+)(?:\s+(.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        const id = match[1].trim();
        const envStr = match[2]?.trim();

        try {
            if (!envStr) {
                // View current env
                const data = await bp.getEnv(id);
                const vars = Object.entries(data.env);
                if (!vars.length) return bot.sendMessage(chatId, `🌍 No environment variables set.\n\nSet with:\n/bp_env ${id} KEY=value KEY2=value2`);
                let text = `🌍 *Environment Variables*\n\n`;
                for (const [k, v] of vars) text += `\`${k}\` = \`${v}\`\n`;
                bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
            } else {
                // Set env vars
                const current = (await bp.getEnv(id)).env;
                const pairs = envStr.split(/\s+/);
                for (const pair of pairs) {
                    const eqIdx = pair.indexOf('=');
                    if (eqIdx < 1) continue;
                    current[pair.slice(0, eqIdx)] = pair.slice(eqIdx + 1);
                }
                await bp.updateEnv(id, current);
                bot.sendMessage(chatId, `✅ Environment variables updated!\n\nRestart your project to apply:\n/bp_restart ${id}`);
            }
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });
};

const bp = require('../brucepanel-api');

module.exports = function(bot, AUTHORIZED_ADMINS) {
    // Interactive multi-step creation
    const sessions = new Map();

    bot.onText(/\/bp_new$/, async (msg) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        sessions.set(chatId, { step: 'name' });
        bot.sendMessage(chatId, '🚀 *New BrucePanel Project*\n\nStep 1/4 — Enter the project *name*:', { parse_mode: 'Markdown' });
    });

    // Also support inline: /bp_new <name> | <github_url> | <start_cmd>
    bot.onText(/\/bp_new (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ Not authorized.');
        const parts = match[1].split('|').map(s => s.trim());
        if (parts.length < 2) return bot.sendMessage(chatId, '❌ Format: /bp\\_new name | github\\_url | start\\_cmd\n\nOr just /bp\\_new for step-by-step setup.', { parse_mode: 'Markdown' });
        const [name, githubUrl, startCommand = 'npm start'] = parts;
        try {
            await bot.sendMessage(chatId, `⏳ Creating *${name}*...`, { parse_mode: 'Markdown' });
            const project = await bp.createProject({ name, githubUrl, startCommand, description: 'Created via Telegram Bot' });
            bot.sendMessage(chatId,
                `✅ *Project Created!*\n\n` +
                `📦 Name: ${project.name}\n` +
                `🆔 ID: \`${project.id}\`\n` +
                `🔧 Command: \`${project.startCommand}\`\n` +
                `📡 Status: ${project.status}\n\n` +
                (githubUrl ? `🔗 Deploying from GitHub now...\nCheck logs with:\n/bp_logs ${project.id}` : `▶️ Start with: /bp_start ${project.id}`),
                { parse_mode: 'Markdown' }
            );
        } catch (e) {
            bot.sendMessage(chatId, `❌ Error: ${e.message}`);
        }
    });

    // Handle step-by-step
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const session = sessions.get(chatId);
        if (!session || msg.text?.startsWith('/')) return;

        switch (session.step) {
            case 'name':
                session.name = msg.text.trim();
                session.step = 'github';
                bot.sendMessage(chatId, `Step 2/4 — GitHub URL (or send \`skip\` to skip):`, { parse_mode: 'Markdown' });
                break;
            case 'github':
                session.githubUrl = msg.text.trim() === 'skip' ? '' : msg.text.trim();
                session.step = 'cmd';
                bot.sendMessage(chatId, `Step 3/4 — Start command (e.g. \`npm start\`, \`node bot.js\`):`, { parse_mode: 'Markdown' });
                break;
            case 'cmd':
                session.startCommand = msg.text.trim();
                session.step = 'desc';
                bot.sendMessage(chatId, `Step 4/4 — Description (or send \`skip\`):`, { parse_mode: 'Markdown' });
                break;
            case 'desc':
                session.description = msg.text.trim() === 'skip' ? '' : msg.text.trim();
                sessions.delete(chatId);
                try {
                    await bot.sendMessage(chatId, `⏳ Creating *${session.name}*...`, { parse_mode: 'Markdown' });
                    const project = await bp.createProject({
                        name: session.name,
                        githubUrl: session.githubUrl,
                        startCommand: session.startCommand,
                        description: session.description
                    });
                    bot.sendMessage(chatId,
                        `✅ *Project Created!*\n\n` +
                        `📦 Name: ${project.name}\n` +
                        `🆔 ID: \`${project.id}\`\n` +
                        `🔧 Command: \`${project.startCommand}\`\n` +
                        `📡 Status: ${project.status}\n\n` +
                        (session.githubUrl ? `🔗 Deploying from GitHub...\n/bp_logs ${project.id}` : `/bp_start ${project.id}`),
                        { parse_mode: 'Markdown' }
                    );
                } catch (e) {
                    bot.sendMessage(chatId, `❌ Error: ${e.message}`);
                }
                break;
        }
    });
};

const fetch = require('node-fetch');
const { PANEL_DOMAIN, PANEL_API_KEY } = require('../config');

module.exports = function resetPasswordCommand(bot, AUTHORIZED_ADMINS) {
    bot.onText(/\/resetpassword (\S+) (\S+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        if (!AUTHORIZED_ADMINS.includes(chatId)) return bot.sendMessage(chatId, '❌ You are not authorized.');

        const usernameOrId = match[1].trim();
        const newPassword  = match[2].trim();

        if (newPassword.length < 8) {
            return bot.sendMessage(chatId, '❌ Password must be at least 8 characters.');
        }

        try {
            const usersRes = await fetch(`${PANEL_DOMAIN}/api/application/users`, {
                headers: { Accept: 'application/json', Authorization: 'Bearer ' + PANEL_API_KEY }
            });
            const usersData = await usersRes.json();
            if (usersData.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(usersData.errors[0]));

            const user = usersData.data.find(u =>
                u.attributes.username === usernameOrId || u.attributes.id == usernameOrId
            );
            if (!user) return bot.sendMessage(chatId, `❌ User "${usernameOrId}" not found.`);

            const u = user.attributes;

            const updateRes = await fetch(`${PANEL_DOMAIN}/api/application/users/${u.id}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + PANEL_API_KEY
                },
                body: JSON.stringify({
                    email: u.email,
                    username: u.username,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    language: 'en',
                    password: newPassword
                })
            });

            const result = await updateRes.json();
            if (result.errors) return bot.sendMessage(chatId, '❌ ' + JSON.stringify(result.errors[0]));

            bot.sendMessage(chatId,
                `✅ *Password Reset*\n\n👤 User: *${u.username}*\n🔐 New Password: *${newPassword}*`,
                { parse_mode: 'Markdown' }
            );
        } catch (err) {
            bot.sendMessage(chatId, '❌ Error: ' + err.message);
        }
    });
};

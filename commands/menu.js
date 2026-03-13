module.exports = function menuCommand(bot) {
    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        const text = `
📋 *Available Commands*

👤 *User Management*
/createuser username,email — Create a panel user
/cadminpanel username,email — Create an admin user
/userinfo username — Full details on a user
/resetpassword username newpass — Reset a user's password
/listusers — List all panel users
/listpaneladmins — List all panel admins
/deluser username — Delete a user

🖥️ *Server Management*
/addserver name ram username — Add server to existing user
/1gb username,telegramID — Create user + 1GB server
/2gb username,telegramID — Create user + 2GB server
/unli username,telegramID — Create user + unlimited server
/listservers — List all servers
/renameserver id newname — Rename a server
/editlimits id ram cpu disk — Edit resource limits
/suspendserver id — Suspend a server
/unsuspendserver id — Unsuspend a server
/reinstallserver id — Reinstall a server
/delserver id — Delete a server

🌐 *Node & Allocation Info*
/listnodes — List all Wings nodes
/listallocations — Show free/used IPs per node

📊 *Panel Stats*
/stats — Total users, servers, nodes summary

📈 *Status*
/start — Bot & VPS status with ping
`;
        bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    });
};

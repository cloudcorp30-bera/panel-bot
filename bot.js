const TelegramBot = require('node-telegram-bot-api');
const createServerCommand    = require('./commands/createServer');
const menuCommand            = require('./commands/menu');
const listUsersCommand       = require('./commands/listUsers');
const listServersCommand     = require('./commands/listServers');
const delUserCommand         = require('./commands/delUser');
const delServerCommand       = require('./commands/delServer');
const statusMenuCommand      = require('./commands/start');
const cadminPanelCommand     = require('./commands/cadminpanel');
const listPanelAdminsCommand = require('./commands/listpaneladmins');
const createUserCommand      = require('./commands/createuser');
const addServerCommand       = require('./commands/addserver');
const suspendServerCommand   = require('./commands/suspendserver');
const unsuspendServerCommand = require('./commands/unsuspendserver');
const reinstallServerCommand = require('./commands/reinstallserver');
const renameServerCommand    = require('./commands/renameserver');
const editLimitsCommand      = require('./commands/editlimits');
const userInfoCommand        = require('./commands/userinfo');
const resetPasswordCommand   = require('./commands/resetpassword');
const statsCommand           = require('./commands/stats');
const listNodesCommand       = require('./commands/listnodes');
const listAllocationsCommand = require('./commands/listallocations');

// BrucePanel commands
const bpListCommand       = require('./commands/bp_list');
const bpNewCommand        = require('./commands/bp_new');
const bpStartCommand      = require('./commands/bp_start');
const bpStopCommand       = require('./commands/bp_stop');
const bpRestartCommand    = require('./commands/bp_restart');
const bpDeployCommand     = require('./commands/bp_deploy');
const bpLogsCommand       = require('./commands/bp_logs');
const bpDeleteCommand     = require('./commands/bp_delete');
const bpStatusCommand     = require('./commands/bp_status');
const bpEnvCommand        = require('./commands/bp_env');
const bpReinstallCommand  = require('./commands/bp_reinstall');

const { TELEGRAM_TOKEN, AUTHORIZED_ADMINS } = require('./config');

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

menuCommand(bot);
createServerCommand(bot, AUTHORIZED_ADMINS);
listUsersCommand(bot, AUTHORIZED_ADMINS);
listServersCommand(bot, AUTHORIZED_ADMINS);
delUserCommand(bot, AUTHORIZED_ADMINS);
delServerCommand(bot, AUTHORIZED_ADMINS);
statusMenuCommand(bot);
cadminPanelCommand(bot, AUTHORIZED_ADMINS);
listPanelAdminsCommand(bot, AUTHORIZED_ADMINS);
createUserCommand(bot, AUTHORIZED_ADMINS);
addServerCommand(bot, AUTHORIZED_ADMINS);
suspendServerCommand(bot, AUTHORIZED_ADMINS);
unsuspendServerCommand(bot, AUTHORIZED_ADMINS);
reinstallServerCommand(bot, AUTHORIZED_ADMINS);
renameServerCommand(bot, AUTHORIZED_ADMINS);
editLimitsCommand(bot, AUTHORIZED_ADMINS);
userInfoCommand(bot, AUTHORIZED_ADMINS);
resetPasswordCommand(bot, AUTHORIZED_ADMINS);
statsCommand(bot, AUTHORIZED_ADMINS);
listNodesCommand(bot, AUTHORIZED_ADMINS);
listAllocationsCommand(bot, AUTHORIZED_ADMINS);

// BrucePanel commands
bpListCommand(bot, AUTHORIZED_ADMINS);
bpNewCommand(bot, AUTHORIZED_ADMINS);
bpStartCommand(bot, AUTHORIZED_ADMINS);
bpStopCommand(bot, AUTHORIZED_ADMINS);
bpRestartCommand(bot, AUTHORIZED_ADMINS);
bpDeployCommand(bot, AUTHORIZED_ADMINS);
bpLogsCommand(bot, AUTHORIZED_ADMINS);
bpDeleteCommand(bot, AUTHORIZED_ADMINS);
bpStatusCommand(bot, AUTHORIZED_ADMINS);
bpEnvCommand(bot, AUTHORIZED_ADMINS);
bpReinstallCommand(bot, AUTHORIZED_ADMINS);

bot.getMe().then((me) => {
    console.log(`✅ Telegram bot @${me.username} is running...`);
}).catch((err) => {
    console.error('❌ Failed to get bot info:', err);
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

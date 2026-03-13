module.exports = {
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '7977104365:AAGvfn_ql-n_vmButqA0x9Go5e-Ct4iKgV0',
    PANEL_DOMAIN: process.env.PANEL_DOMAIN || 'https://bera-panel-production.up.railway.app',
    PANEL_API_KEY: process.env.PANEL_API_KEY || 'ptla_EW6B5h4UHJYKd0L3M1OnRuv8IBYpHszuaqSxXkPe3II',
    AUTHORIZED_ADMINS: (process.env.AUTHORIZED_ADMINS || '7038158483').split(',').map(Number),
    GLOBAL_EGG: process.env.GLOBAL_EGG || '15',
    GLOBAL_LOCATION: process.env.GLOBAL_LOCATION || '1'
};

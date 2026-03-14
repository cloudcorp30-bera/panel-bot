const fetch = require('node-fetch');

const BP_URL = process.env.BRUCEPANEL_API_URL || 'http://localhost:8080/api/brucepanel';
const BP_USER = 'telegrambot';
const BP_PASS = process.env.BRUCEPANEL_BOT_PASS || 'BruceBot@2025!';

let _token = null;

async function ensureToken() {
    if (_token) return _token;
    // Try login first
    let res = await fetch(`${BP_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: BP_USER, password: BP_PASS })
    });
    let data = await res.json();
    if (data.token) { _token = data.token; return _token; }

    // If login fails, register
    res = await fetch(`${BP_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: BP_USER, password: BP_PASS })
    });
    data = await res.json();
    if (data.token) { _token = data.token; return _token; }
    throw new Error('BrucePanel auth failed: ' + (data.error || 'unknown'));
}

async function bp(method, path, body) {
    const token = await ensureToken();
    const res = await fetch(`${BP_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (res.status === 401) { _token = null; throw new Error('Auth expired, please retry'); }
    if (!res.ok) throw new Error(data.error || 'BrucePanel API error');
    return data;
}

module.exports = {
    listProjects: () => bp('GET', '/projects'),
    getProject: (id) => bp('GET', `/projects/${id}`),
    createProject: (data) => bp('POST', '/projects', data),
    deleteProject: (id) => bp('DELETE', `/projects/${id}`),
    startProject: (id) => bp('POST', `/projects/${id}/start`),
    stopProject: (id) => bp('POST', `/projects/${id}/stop`),
    restartProject: (id) => bp('POST', `/projects/${id}/restart`),
    reinstallProject: (id) => bp('POST', `/projects/${id}/reinstall`),
    deployProject: (id, githubUrl) => bp('POST', `/projects/${id}/deploy`, { githubUrl }),
    getLogs: (id) => bp('GET', `/projects/${id}/logs?lines=30`),
    getEnv: (id) => bp('GET', `/projects/${id}/env`),
    updateEnv: (id, env) => bp('PUT', `/projects/${id}/env`, { env }),
};

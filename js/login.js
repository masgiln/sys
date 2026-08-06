function getApiBaseUrl() {
    const hostname = window.location.hostname || '127.0.0.1';
    return `${window.location.protocol}//${hostname}:5000/api`;
}

const API_URL = getApiBaseUrl();

async function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById('auth-reg-username').value.trim();
    const password = document.getElementById('auth-reg-password').value;
    const fullName = document.getElementById('auth-reg-fullname').value.trim();
    const department = document.getElementById('auth-reg-department').value;
    const role = document.getElementById('auth-reg-role').value.trim();

    if (!username || !password || !fullName || !department || !role) {
        showAuthToast('Please fill in all fields.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, fullName, department, role })
        });

        const data = await response.json();

        if (response.ok) {
            await syncUserToMainDB(fullName, department, role, username);
            showAuthToast('Registration successful! Please login.', 'success');
            document.getElementById('auth-reg-form').reset();
            const loginInput = document.getElementById('auth-login-username');
            if (loginInput) loginInput.value = username;
            window.setTimeout(() => {
                document.getElementById('auth-reg-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        } else {
            showAuthToast(data.error || 'Unable to create account.', 'error');
        }
    } catch (error) {
        console.error(error);
        showAuthToast('Failed to connect to Python backend.', 'error');
    }
}

async function syncUserToMainDB(fullName, department, role, username = '') {
    try {
        const usersReq = await fetch(`${API_URL}/masterData/users`);
        let usersData = await usersReq.json();
        const normalizedUsers = Array.isArray(usersData?.data) ? usersData.data : [];
        const existingUser = normalizedUsers.find(u => u.name && u.name.toLowerCase() === fullName.toLowerCase());

        if (!existingUser) {
            normalizedUsers.push({
                name: fullName,
                department,
                role,
                username: username || fullName.toLowerCase().replace(/\s+/g, '.'),
                addedAt: new Date().toISOString()
            });

            await fetch(`${API_URL}/masterData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'users', data: normalizedUsers })
            });
        }
    } catch (e) {
        console.warn('Could not sync to master data. Is backend running?', e);
    }
}

async function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById('auth-login-username').value.trim();
    const password = document.getElementById('auth-login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('active_session', JSON.stringify(data.user));
            showAuthToast(`Welcome back, ${data.user.fullName}!`, 'success');

            setTimeout(() => {
                const overlay = document.getElementById('auth-overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
                if (window.location.pathname.endsWith('index.html')) {
                    window.location.href = 'home.html';
                } else {
                    injectLogoutButton();
                }
            }, 900);
        } else {
            showAuthToast(data.error || 'Unable to sign in.', 'error');
        }
    } catch (error) {
        console.error(error);
        showAuthToast('Login failed. Ensure Python server is running.', 'error');
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('active_session');
        window.location.href = 'index.html';
    }
}

// UI Construction & Injection logic remains the same below
function toggleAuthMode(mode) {
    const loginForm = document.getElementById('auth-login-container');
    const regForm = document.getElementById('auth-reg-container');
    
    if (mode === 'register') {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
    } else {
        regForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function showAuthToast(message, type) {
    if (typeof showToast === 'function') {
        showToast(message, type, 3000);
    } else if (typeof window.showToast === 'function') {
        window.showToast(message, type, 3000);
    } else {
        alert(message);
    }
}

function attachAuthFormHandlers() {
    const loginForm = document.getElementById('auth-login-form');
    const regForm = document.getElementById('auth-reg-form');

    if (loginForm && !loginForm.dataset.boundLogin) {
        loginForm.addEventListener('submit', loginUser);
        loginForm.dataset.boundLogin = 'true';
    }

    if (regForm && !regForm.dataset.boundRegister) {
        regForm.addEventListener('submit', registerUser);
        regForm.dataset.boundRegister = 'true';
    }
}

function injectLogoutButton() {
    const headerDiv = document.querySelector('header .flex.items-center.space-x-3');
    if (headerDiv && !document.getElementById('btn-logout')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'btn-logout';
        logoutBtn.type = 'button';
        logoutBtn.className = 'bg-red-600 p-2 px-3 rounded-lg hover:bg-red-500 transition shadow-md text-white font-semibold flex items-center';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i> Logout';
        logoutBtn.onclick = logoutUser;
        headerDiv.appendChild(logoutBtn);
    }

    const navMenu = document.querySelector('.nav-content');
    const session = JSON.parse(localStorage.getItem('active_session'));
    if (navMenu && session && !document.getElementById('nav-user-info')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'nav-user-info';
        userInfo.className = 'mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100 flex items-center';
        userInfo.innerHTML = `
            <div class="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg mr-3 shadow-inner">
                ${session.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
                <p class="text-sm font-bold text-teal-800 leading-tight">${session.fullName}</p>
                <p class="text-xs text-teal-600">${session.role}</p>
            </div>
        `;
        navMenu.insertBefore(userInfo, navMenu.children[1]);
    }
}

function buildAuthUI() {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center min-h-screen';
    overlay.style.background = `radial-gradient(circle at top left, rgba(220, 38, 38, 0.16), transparent 24%),
                                radial-gradient(circle at top right, rgba(37, 99, 235, 0.16), transparent 28%),
                                radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.14), transparent 24%),
                                linear-gradient(135deg, #fff7f7 0%, #f5f7ff 36%, #f7f3ff 68%, #f0fdf4 100%)`;
    overlay.style.backdropFilter = 'blur(10px)';

    overlay.innerHTML = `
        <div class="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600"></div>
            
            <div class="text-center mb-8 mt-2">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-lg mb-4">
                    <i class="fas fa-warehouse text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Production Inventory</h2>
                <p class="text-sm text-gray-500 mt-1">Please authenticate to continue</p>
            </div>

            <div id="auth-login-container">
                <form id="auth-login-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div class="relative">
                            <i class="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                            <input type="text" id="auth-login-username" required class="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Enter username">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div class="relative">
                            <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                            <input type="password" id="auth-login-password" required class="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="••••••••">
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200">
                        Login Securely
                    </button>
                </form>
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">Don't have an account? <button type="button" onclick="toggleAuthMode('register')" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline">Register here</button></p>
                </div>
            </div>

            <div id="auth-reg-container" class="hidden">
                <form id="auth-reg-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" id="auth-reg-fullname" required class="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., John Doe">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="auth-reg-username" required class="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="Username">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="auth-reg-password" required class="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="••••••••">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select id="auth-reg-department" required class="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500">
                                <option value="Admin">Admin</option>
                                <option value="HR">HR</option>
                                <option value="IT">IT</option>
                                <option value="GA">GA</option>
                                <option value="Finance">Finance</option>
                                <option value="Production">Production</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input type="text" id="auth-reg-role" required class="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., Staff">
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 mt-2">
                        Create Account
                    </button>
                </form>
                <div class="mt-4 text-center">
                    <p class="text-sm text-gray-600">Already have an account? <button type="button" onclick="toggleAuthMode('login')" class="text-teal-600 hover:text-teal-800 font-semibold hover:underline">Back to Login</button></p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('auth-login-form').addEventListener('submit', loginUser);
    document.getElementById('auth-reg-form').addEventListener('submit', registerUser);
}

function initializeAuthSystem() {
    attachAuthFormHandlers();

    const session = localStorage.getItem('active_session');
    if (!session) {
        if (window.location.pathname.endsWith('index.html')) {
            initializeLandingPage();
        } else {
            window.location.href = 'index.html';
        }
    } else {
        window.addEventListener('DOMContentLoaded', injectLogoutButton);
    }
}

async function initializeLandingPage() {
    const list = document.getElementById('recent-users-list');
    const count = document.getElementById('registered-user-count');
    if (!list || !count) return;

    try {
        const response = await fetch(`${API_URL}/masterData/users`);
        const data = await response.json();
        const users = Array.isArray(data?.data) ? data.data : [];
        const recentUsers = users.slice().sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || '')).slice(0, 4);

        count.textContent = users.length.toString();
        if (!recentUsers.length) {
            list.innerHTML = '<div class="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500">No registered users yet. Create the first account to populate this list.</div>';
            return;
        }

        list.innerHTML = recentUsers.map(user => `
            <div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-3 py-3">
                <div>
                    <p class="font-semibold text-slate-900">${user.name || 'Unnamed user'}</p>
                    <p class="text-sm text-slate-500">${user.department || 'Unassigned'} • ${user.role || 'Role pending'}</p>
                </div>
                <div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">${user.username ? user.username : 'active'}</div>
            </div>
        `).join('');
    } catch (error) {
        console.warn('Could not load recent users', error);
        list.innerHTML = '<div class="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500">The landing page is ready, but the recent-user feed could not be loaded right now.</div>';
    }
}

initializeAuthSystem();

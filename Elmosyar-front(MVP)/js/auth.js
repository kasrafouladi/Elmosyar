// Authentication functions
let currentUser = null;

function checkAuth() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateNavbar();
        return true;
    }
    return false;
}

function updateNavbar() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
    } else {
        authButtons.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

async function login(email, password, remember = false) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username_or_email: email,
                password: password,
                remember: remember
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            updateNavbar();
            showMessage('ورود موفقیت‌آمیز بود!');
            showPage('home');
            return true;
        } else {
            showMessage(data.message, 'error');
            return false;
        }
    } catch (error) {
        showMessage('خطا در ارتباط با سرور', 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function signup(username, email, password, passwordConfirm) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                password_confirm: passwordConfirm
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('ثبت‌نام موفقیت‌آمیز بود. لطفا ایمیل خود را بررسی کنید.');
            showPage('login');
            return true;
        } else {
            showMessage(data.message, 'error');
            return false;
        }
    } catch (error) {
        showMessage('خطا در ارتباط با سرور', 'error');
        return false;
    } finally {
        hideLoading();
    }
}

// اضافه کردن توابع بازیابی رمز عبور
async function requestPasswordReset(email) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/password-reset/request/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('ایمیل بازیابی رمز عبور ارسال شد. لطفا صندوق ایمیل خود را بررسی کنید.');
            showPage('login');
            return true;
        } else {
            showMessage(data.message, 'error');
            return false;
        }
    } catch (error) {
        showMessage('خطا در ارتباط با سرور', 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function resetPassword(token, password, passwordConfirm) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/password-reset/${token}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password,
                password_confirm: passwordConfirm
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.');
            showPage('login');
            return true;
        } else {
            showMessage(data.message, 'error');
            return false;
        }
    } catch (error) {
        showMessage('خطا در ارتباط با سرور', 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function logout() {
    showLoading();
    try {
        await fetch(`${API_BASE}/api/logout/`, {
            method: 'POST',
            credentials: 'include'
        });
        
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateNavbar();
        showMessage('خروج موفقیت‌آمیز بود');
        showPage('home');
    } catch (error) {
        showMessage('خطا در خروج', 'error');
    } finally {
        hideLoading();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        checkAuth, 
        login, 
        signup, 
        logout, 
        currentUser,
        requestPasswordReset,
        resetPassword
    };
}
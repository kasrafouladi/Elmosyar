class Auth {
    constructor() {
        this.currentUser = null;
        this.checkAuth();
    }

    async checkAuth() {
        const { success, data } = await apiCall('/profile/');
        if (success) {
            this.currentUser = data.user;
            this.updateUI();
        } else {
            this.currentUser = null;
            this.updateUI();
        }
    }

    async login(credentials) {
        const { success, data } = await apiCall('/login/', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (success) {
            this.currentUser = data.user;
            this.updateUI();
            showMessage('ورود موفقیت‌آمیز بود!');
            loadPage('feed');
            return true;
        } else {
            showMessage(data.message || 'خطا در ورود', 'error');
            return false;
        }
    }

    async signup(userData) {
        const { success, data } = await apiCall('/signup/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (success) {
            showMessage('ثبت‌نام موفقیت‌آمیز بود! لطفا ایمیل خود را بررسی کنید.');
            loadPage('login');
            return true;
        } else {
            showMessage(data.message || 'خطا در ثبت‌نام', 'error');
            return false;
        }
    }

    async logout() {
        const { success } = await apiCall('/logout/', {
            method: 'POST'
        });

        if (success) {
            this.currentUser = null;
            this.updateUI();
            showMessage('خروج موفقیت‌آمیز بود!');
            loadPage('login');
        }
    }

    updateUI() {
        const nav = document.getElementById('nav');
        
        if (this.currentUser) {
            nav.innerHTML = `
                <a href="#" onclick="loadPage('feed')">فید</a>
                <a href="#" onclick="loadPage('profile')">پروفایل</a>
                <a href="#" onclick="loadPage('notifications')">اعلان‌ها</a>
                <a href="#" onclick="auth.logout()">خروج</a>
            `;
        } else {
            nav.innerHTML = `
                <a href="#" onclick="loadPage('login')">ورود</a>
                <a href="#" onclick="loadPage('signup')">ثبت‌نام</a>
            `;
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

const auth = new Auth();
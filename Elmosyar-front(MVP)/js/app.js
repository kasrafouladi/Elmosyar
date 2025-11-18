// Page management
async function loadPage(page, param = null) {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

    switch (page) {
        case 'login':
            await loadLoginPage();
            break;
        case 'signup':
            await loadSignupPage();
            break;
        case 'feed':
            await loadFeedPage();
            break;
        case 'profile':
            await loadProfilePage();
            break;
        case 'notifications':
            await loadNotificationsPage();
            break;
        case 'post-detail':
            await loadPostDetailPage(param);
            break;
        default:
            content.innerHTML = '<div class="welcome">صفحه مورد نظر یافت نشد</div>';
    }
}

async function loadLoginPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>ورود به حساب کاربری</h2>
            <form onsubmit="event.preventDefault(); handleLogin(this)">
                <div class="form-group">
                    <label for="username">نام کاربری یا ایمیل:</label>
                    <input type="text" id="username" name="username_or_email" required>
                </div>
                <div class="form-group">
                    <label for="password">رمز عبور:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="remember"> مرا به خاطر بسپار
                    </label>
                </div>
                <button type="submit" class="btn btn-primary btn-block">ورود</button>
            </form>
            <p class="text-center mt-2">
                حساب کاربری ندارید؟ 
                <a href="#" onclick="loadPage('signup')">ثبت‌نام کنید</a>
            </p>
        </div>
    `;
}

async function loadSignupPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>ثبت‌نام</h2>
            <form onsubmit="event.preventDefault(); handleSignup(this)">
                <div class="form-group">
                    <label for="signup-username">نام کاربری:</label>
                    <input type="text" id="signup-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="signup-email">ایمیل:</label>
                    <input type="email" id="signup-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="signup-password">رمز عبور:</label>
                    <input type="password" id="signup-password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="signup-password-confirm">تکرار رمز عبور:</label>
                    <input type="password" id="signup-password-confirm" name="password_confirm" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">ثبت‌نام</button>
            </form>
            <p class="text-center mt-2">
                قبلاً ثبت‌نام کرده‌اید؟ 
                <a href="#" onclick="loadPage('login')">وارد شوید</a>
            </p>
        </div>
    `;
}

async function loadFeedPage() {
    if (!auth.isAuthenticated()) {
        showMessage('لطفاً ابتدا وارد شوید', 'error');
        loadPage('login');
        return;
    }

    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="posts-container">
            <div class="create-post mb-2">
                <h3>ایجاد پست جدید</h3>
                <form onsubmit="event.preventDefault(); handleCreatePost(this)">
                    <div class="form-group">
                        <textarea name="content" placeholder="چه چیزی در ذهن شماست؟..." required></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" name="category" placeholder="اتاق (مثلاً: programming, music, ...)" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="tags" placeholder="تگ‌ها (با کاما جدا کنید)">
                    </div>
                    <div class="form-group">
                        <input type="text" name="mentions" placeholder="منشن کاربران (با کاما جدا کنید)">
                    </div>
                    <div class="form-group">
                        <input type="file" name="media" multiple accept="image/*,video/*,audio/*">
                    </div>
                    <button type="submit" class="btn btn-primary">ارسال پست</button>
                </form>
            </div>
            <div id="posts-list">
                <!-- Posts will be loaded here -->
            </div>
        </div>
    `;

    // Load posts
    posts.loadPosts();
}

async function loadProfilePage() {
    if (!auth.isAuthenticated()) {
        showMessage('لطفاً ابتدا وارد شوید', 'error');
        loadPage('login');
        return;
    }

    const content = document.getElementById('content');
    const user = auth.currentUser;

    content.innerHTML = `
        <div class="profile-header">
            <img src="${user.profile_picture || '/static/default-avatar.png'}" 
                 alt="Profile Picture" class="profile-picture">
            <h2>${escapeHtml(user.first_name || '')} ${escapeHtml(user.last_name || '')}</h2>
            <p>@${escapeHtml(user.username)}</p>
            <p>${escapeHtml(user.bio || '')}</p>
            <p>شماره دانشجویی: ${escapeHtml(user.student_id || '')}</p>
        </div>

        <div class="form-container">
            <h3>ویرایش پروفایل</h3>
            <form onsubmit="event.preventDefault(); handleUpdateProfile(this)">
                <div class="form-group">
                    <label>نام:</label>
                    <input type="text" name="first_name" value="${escapeHtml(user.first_name || '')}">
                </div>
                <div class="form-group">
                    <label>نام خانوادگی:</label>
                    <input type="text" name="last_name" value="${escapeHtml(user.last_name || '')}">
                </div>
                <div class="form-group">
                    <label>شماره دانشجویی:</label>
                    <input type="text" name="student_id" value="${escapeHtml(user.student_id || '')}">
                </div>
                <div class="form-group">
                    <label>بیوگرافی:</label>
                    <textarea name="bio">${escapeHtml(user.bio || '')}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">ذخیره تغییرات</button>
            </form>
        </div>

        <div class="mt-2">
            <h3>پست‌های من</h3>
            <div id="user-posts">
                <!-- User posts will be loaded here -->
            </div>
        </div>
    `;

    // Load user posts
    posts.loadUserPosts(user.username);
}

async function loadNotificationsPage() {
    if (!auth.isAuthenticated()) {
        showMessage('لطفاً ابتدا وارد شوید', 'error');
        loadPage('login');
        return;
    }

    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading">در حال بارگذاری اعلان‌ها...</div>';

    const { success, data } = await apiCall('/notifications/');
    
    if (success) {
        const notificationsHTML = data.notifications.map(notif => `
            <div class="notification ${notif.is_read ? '' : 'unread'}">
                <p><strong>${escapeHtml(notif.sender)}</strong> - ${escapeHtml(notif.message)}</p>
                <small>${formatDate(notif.created_at)}</small>
            </div>
        `).join('');

        content.innerHTML = `
            <div class="notifications-container">
                <h2>اعلان‌ها</h2>
                ${notificationsHTML.length > 0 ? notificationsHTML : '<p>هیچ اعلانی وجود ندارد</p>'}
            </div>
        `;
    } else {
        showMessage('خطا در بارگذاری اعلان‌ها', 'error');
    }
}

async function loadPostDetailPage(postId) {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading">در حال بارگذاری پست...</div>';
    
    await posts.loadPostDetail(postId);
}

// Form handlers
async function handleLogin(form) {
    const formData = new FormData(form);
    const credentials = {
        username_or_email: formData.get('username_or_email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };

    await auth.login(credentials);
}

async function handleSignup(form) {
    const formData = new FormData(form);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        password_confirm: formData.get('password_confirm')
    };

    await auth.signup(userData);
}

async function handleCreatePost(form) {
    const formData = new FormData(form);
    const postData = {
        content: formData.get('content'),
        category: formData.get('category'),
        tags: formData.get('tags'),
        mentions: formData.get('mentions'),
        media: formData.getAll('media')
    };

    await posts.createPost(postData);
}

async function handleUpdateProfile(form) {
    const formData = new FormData(form);
    const profileData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        student_id: formData.get('student_id'),
        bio: formData.get('bio')
    };

    const { success, data } = await apiCall('/profile/update/', {
        method: 'POST',
        body: JSON.stringify(profileData)
    });

    if (success) {
        showMessage('پروفایل با موفقیت به‌روزرسانی شد!');
        auth.currentUser = data.user;
        auth.updateUI();
    } else {
        showMessage(data.message || 'خطا در به‌روزرسانی پروفایل', 'error');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    auth.checkAuth();
});
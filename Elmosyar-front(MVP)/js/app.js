// Main application controller
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();
    
    // Load initial page based on URL hash
    const hash = window.location.hash || '#home';
    showPage(hash.substring(1));
    
    // Handle browser back/forward
    window.addEventListener('hashchange', function() {
        const page = window.location.hash.substring(1).split('?')[0];
        showPage(page);
    });
});

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show loading
    showLoading();
    
    // Load the requested page
    setTimeout(() => {
        loadPageContent(pageName);
    }, 300);
}

async function loadPageContent(pageName) {
    try {
        const response = await fetch(`pages/${pageName}.html`);
        const html = await response.text();
        
        document.getElementById('main-content').innerHTML = html;
        
        // Initialize page-specific functionality
        initializePage(pageName);
        
        // Update URL hash without triggering hashchange
        const currentHash = window.location.hash.substring(1);
        if (currentHash !== pageName) {
            window.location.hash = pageName;
        }
        
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('main-content').innerHTML = `
            <div class="card">
                <h2>خطا در بارگذاری صفحه</h2>
                <p>صفحه مورد نظر یافت نشد.</p>
                <button class="btn btn-primary" onclick="showPage('home')">بازگشت به خانه</button>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

function initializePage(pageName) {
    switch (pageName) {
        case 'home':
            if (currentUser) {
                loadPosts('home-posts', '/api/posts/');
            }
            break;
            
        case 'login':
            document.getElementById('login-form').addEventListener('submit', handleLogin);
            break;
            
        case 'signup':
            document.getElementById('signup-form').addEventListener('submit', handleSignup);
            break;
            
        case 'forgot-password':
            document.getElementById('forgot-password-form').addEventListener('submit', handleForgotPassword);
            break;
            
        case 'reset-password':
            document.getElementById('reset-password-form').addEventListener('submit', handleResetPassword);
            break;
            
        case 'profile':
            if (currentUser) {
                loadUserProfile(currentUser.username);
            } else {
                showMessage('لطفا ابتدا وارد شوید', 'error');
                showPage('login');
            }
            break;
            
        case 'create-post':
            if (currentUser) {
                document.getElementById('post-form').addEventListener('submit', handleCreatePost);
            } else {
                showMessage('لطفا ابتدا وارد شوید', 'error');
                showPage('login');
            }
            break;
            
        case 'explore':
            document.getElementById('room-search-form').addEventListener('submit', handleRoomSearch);
            break;
            
        case 'search':
            document.getElementById('user-search-form').addEventListener('submit', handleUserSearch);
            break;
            
        case 'post-detail':
            // Already handled in showPostDetail function
            break;
    }
    
    // Handle URL parameters
    handleUrlParameters(pageName);
}

function handleUrlParameters(pageName) {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    
    switch (pageName) {
        case 'profile':
            const user = urlParams.get('user');
            if (user) {
                loadUserProfile(user);
            }
            break;
            
        case 'explore':
            const room = urlParams.get('room');
            if (room) {
                showRoom(room);
            }
            break;
            
        case 'reset-password':
            const token = urlParams.get('token');
            if (token) {
                // ذخیره توکن برای استفاده در فرم
                document.getElementById('reset-password-form').dataset.token = token;
            } else {
                showMessage('لینک بازیابی معتبر نیست', 'error');
                showPage('login');
            }
            break;
    }
}

// Form handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;
    
    await login(email, password, remember);
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-confirm-password').value;
    
    await signup(username, email, password, passwordConfirm);
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    
    if (!email) {
        showMessage('لطفا ایمیل خود را وارد کنید', 'error');
        return;
    }
    
    await requestPasswordReset(email);
}

async function handleResetPassword(e) {
    e.preventDefault();
    
    const password = document.getElementById('new-password').value;
    const passwordConfirm = document.getElementById('confirm-password').value;
    const token = document.getElementById('reset-password-form').dataset.token;
    
    if (!token) {
        showMessage('لینک بازیابی معتبر نیست', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showMessage('رمز عبور و تکرار آن مطابقت ندارند', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('رمز عبور باید حداقل ۸ کاراکتر باشد', 'error');
        return;
    }
    
    await resetPassword(token, password, passwordConfirm);
}

async function handleCreatePost(e) {
    e.preventDefault();
    
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;
    const tags = document.getElementById('post-tags').value;
    const mentions = document.getElementById('post-mentions').value;
    const mediaInput = document.getElementById('post-media');
    
    if (!content.trim() && mediaInput.files.length === 0) {
        showMessage('لطفا محتوا یا فایل رسانه‌ای وارد کنید', 'error');
        return;
    }
    
    if (!category.trim()) {
        showMessage('نام اتاق الزامی است', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('mentions', mentions);
    
    for (let file of mediaInput.files) {
        formData.append('media', file);
    }
    
    const success = await createPost(formData);
    if (success) {
        showPage('home');
    }
}

function handleRoomSearch(e) {
    e.preventDefault();
    const roomName = document.getElementById('room-name').value.trim();
    if (roomName) {
        showRoom(roomName);
    }
}

function handleUserSearch(e) {
    e.preventDefault();
    const username = document.getElementById('search-username').value.trim();
    if (username) {
        searchUsers(username);
    }
}

// Global functions for HTML onclick
window.showPage = showPage;
window.showUserProfile = loadUserProfile;
window.showUserPosts = showUserPosts;
window.showRoom = showRoom;
window.logout = logout;
window.likePost = likePost;
window.showPostDetail = showPostDetail;
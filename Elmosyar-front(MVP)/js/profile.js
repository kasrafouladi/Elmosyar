// Profile functionality
async function loadUserProfile(username) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/users/${username}/posts/`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            // Update profile header
            document.getElementById('profile-header').innerHTML = `
                <div class="profile-avatar">
                    ${data.user.profile_picture 
                        ? `<img src="${data.user.profile_picture}" alt="${data.user.username}" style="width: 100%; height: 100%; border-radius: 50%;">`
                        : '👤'
                    }
                </div>
                <h1 class="profile-name">${data.user.first_name || ''} ${data.user.last_name || ''}</h1>
                <div class="profile-username">@${data.user.username}</div>
                ${data.user.bio ? `<div class="profile-bio">${escapeHtml(data.user.bio)}</div>` : ''}
                <div style="margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="showUserPosts('${data.user.username}')">
                        📝 مشاهده همه پست‌ها
                    </button>
                </div>
            `;
            
            // Load user posts
            const container = document.getElementById('profile-posts');
            if (data.posts && data.posts.length > 0) {
                container.innerHTML = data.posts.map(post => renderPost(post)).join('');
            } else {
                container.innerHTML = '<div class="card"><p style="text-align: center; color: #657786;">این کاربر هنوز پستی منتشر نکرده است</p></div>';
            }
        } else {
            showMessage('کاربر یافت نشد', 'error');
        }
    } catch (error) {
        showMessage('خطا در بارگذاری پروفایل', 'error');
    } finally {
        hideLoading();
    }
}

async function showUserPosts(username) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/users/${username}/posts/`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showPage('user-posts');
            document.getElementById('user-posts-header').innerHTML = `
                <h2>پست‌های ${data.user.username}</h2>
                <a href="#profile?user=${data.user.username}" onclick="showUserProfile('${data.user.username}')" class="btn btn-secondary">
                    ← بازگشت به پروفایل
                </a>
            `;
            
            const container = document.getElementById('user-posts-container');
            if (data.posts && data.posts.length > 0) {
                container.innerHTML = data.posts.map(post => {
                    const roomHtml = post.category 
                        ? `<a href="#explore?room=${encodeURIComponent(post.category)}" onclick="showRoom('${post.category}')" class="room-badge">🏠 ${post.category}</a>` 
                        : '';
                    
                    return renderPost(post) + roomHtml;
                }).join('');
            } else {
                container.innerHTML = '<div class="card"><p style="text-align: center; color: #657786;">این کاربر هنوز پستی منتشر نکرده است</p></div>';
            }
        }
    } catch (error) {
        showMessage('خطا در بارگذاری پست‌ها', 'error');
    } finally {
        hideLoading();
    }
}

async function searchUsers(query) {
    if (!query.trim()) {
        showMessage('لطفا نام کاربری را وارد کنید', 'error');
        return;
    }
    
    showLoading();
    try {
        // Since we don't have a search API, we'll try to load the user's profile directly
        const response = await fetch(`${API_BASE}/api/users/${query}/posts/`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showUserProfile(query);
        } else {
            showMessage('کاربری با این نام وجود ندارد', 'error');
        }
    } catch (error) {
        showMessage('خطا در جستجو', 'error');
    } finally {
        hideLoading();
    }
}

async function showRoom(roomName) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/posts/category/${encodeURIComponent(roomName)}/`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showPage('explore');
            document.getElementById('room-name').value = roomName;
            document.getElementById('room-posts-container').innerHTML = 
                `<h3>پست‌های اتاق: "${roomName}"</h3>` +
                (data.posts && data.posts.length > 0 
                    ? data.posts.map(post => renderPost(post)).join('')
                    : '<div class="card"><p style="text-align: center; color: #657786;">پستی در این اتاق یافت نشد</p></div>'
                );
        }
    } catch (error) {
        showMessage('خطا در بارگذاری اتاق', 'error');
    } finally {
        hideLoading();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadUserProfile, showUserPosts, searchUsers, showRoom };
}
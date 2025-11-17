// Posts functionality
async function loadPosts(containerId, endpoint) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        const container = document.getElementById(containerId);
        
        if (data.success && data.posts.length > 0) {
            container.innerHTML = data.posts.map(post => renderPost(post)).join('');
        } else {
            container.innerHTML = '<div class="card"><p style="text-align: center; color: #657786;">پستی یافت نشد</p></div>';
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById(containerId).innerHTML = '<div class="message error">خطا در بارگذاری پست‌ها</div>';
    } finally {
        hideLoading();
    }
}

function renderPost(post) {
    const mediaHtml = post.media && post.media.length > 0 
        ? post.media.map(media => {
            if (media.type === 'image') {
                return `<div class="post-media"><img src="${media.url}" alt="Post image"></div>`;
            }
            return '';
        }).join('') 
        : '';

    const tagsHtml = post.tags && post.tags.length > 0 
        ? `<div class="post-tags">${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>` 
        : '';

    const roomHtml = post.category 
        ? `<a href="#explore?room=${encodeURIComponent(post.category)}" onclick="showRoom('${post.category}')" class="room-badge">🏠 ${post.category}</a>` 
        : '';

    return `
        <div class="post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">
                    ${post.author.profile_picture 
                        ? `<img src="${post.author.profile_picture}" alt="${post.author.username}" class="post-avatar">`
                        : '👤'
                    }
                </div>
                <div class="post-user">
                    <a href="#profile?user=${post.author.username}" onclick="showUserProfile('${post.author.username}')" class="post-username">${post.author.username}</a>
                    <div class="post-date">${formatDate(post.created_at)}</div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${mediaHtml}
            ${tagsHtml}
            ${roomHtml}
            <div class="post-actions">
                <button class="action-btn ${post.likes_count > 0 ? 'liked' : ''}" onclick="likePost(${post.id})">
                    👍 ${post.likes_count}
                </button>
                <button class="action-btn" onclick="showPostDetail(${post.id})">
                    💬 ${post.comments_count}
                </button>
                <button class="action-btn" onclick="repost(${post.id})">
                    🔄 ${post.reposts_count}
                </button>
            </div>
        </div>
    `;
}

async function createPost(formData) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/posts/`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('پست با موفقیت ایجاد شد!');
            document.getElementById('post-form').reset();
            return true;
        } else {
            showMessage(data.message, 'error');
            return false;
        }
    } catch (error) {
        showMessage('خطا در ایجاد پست', 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function likePost(postId) {
    try {
        const response = await fetch(`${API_BASE}/api/posts/${postId}/like/`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update like count in UI
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            if (postElement) {
                const likeBtn = postElement.querySelector('.action-btn');
                likeBtn.innerHTML = `👍 ${data.likes_count}`;
                if (data.likes_count > 0) {
                    likeBtn.classList.add('liked');
                } else {
                    likeBtn.classList.remove('liked');
                }
            }
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

async function showPostDetail(postId) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/posts/${postId}/`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            // Load post detail page
            showPage('post-detail');
            document.getElementById('post-detail-content').innerHTML = renderPost(data.post);
            loadComments(postId);
        }
    } catch (error) {
        showMessage('خطا در بارگذاری پست', 'error');
    } finally {
        hideLoading();
    }
}

async function loadComments(postId) {
    try {
        const response = await fetch(`${API_BASE}/api/posts/${postId}/comments/`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        const container = document.getElementById('comments-container');
        
        if (data.success && data.comments.length > 0) {
            container.innerHTML = data.comments.map(comment => renderComment(comment)).join('');
        } else {
            container.innerHTML = '<p style="text-align: center; color: #657786;">هنوز نظری وجود ندارد</p>';
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

function renderComment(comment) {
    return `
        <div class="post">
            <div class="post-header">
                <div class="post-avatar">
                    ${comment.user.profile_picture 
                        ? `<img src="${comment.user.profile_picture}" alt="${comment.user.username}" class="post-avatar">`
                        : '👤'
                    }
                </div>
                <div class="post-user">
                    <a href="#profile?user=${comment.user.username}" onclick="showUserProfile('${comment.user.username}')" class="post-username">${comment.user.username}</a>
                    <div class="post-date">${formatDate(comment.created_at)}</div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(comment.content)}</div>
        </div>
    `;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadPosts, renderPost, createPost, likePost, showPostDetail };
}
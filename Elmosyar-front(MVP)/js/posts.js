class Posts {
    constructor() {
        this.currentPosts = [];
    }

    async loadPosts(category = null) {
        const endpoint = category ? `/posts/category/${category}/` : '/posts/';
        const { success, data } = await apiCall(endpoint);
        
        if (success) {
            this.currentPosts = data.posts;
            this.renderPosts();
        } else {
            showMessage('خطا در بارگذاری پست‌ها', 'error');
        }
    }

    async loadUserPosts(username) {
        const { success, data } = await apiCall(`/users/${username}/posts/`);
        
        if (success) {
            this.currentPosts = data.posts;
            this.renderPosts();
        } else {
            showMessage('خطا در بارگذاری پست‌ها', 'error');
        }
    }

    async createPost(postData) {
        const formData = new FormData();
        
        if (postData.content) formData.append('content', postData.content);
        if (postData.tags) formData.append('tags', postData.tags);
        if (postData.category) formData.append('category', postData.category);
        if (postData.mentions) formData.append('mentions', postData.mentions);
        
        if (postData.media) {
            for (let file of postData.media) {
                formData.append('media', file);
            }
        }

        const { success, data } = await apiCall('/posts/', {
            method: 'POST',
            body: formData
        });

        if (success) {
            showMessage('پست با موفقیت ایجاد شد!');
            this.loadPosts();
            return true;
        } else {
            showMessage(data.message || 'خطا در ایجاد پست', 'error');
            return false;
        }
    }

    async likePost(postId) {
        const { success, data } = await apiCall(`/posts/${postId}/like/`, {
            method: 'POST'
        });

        if (success) {
            this.loadPosts();
        }
    }

    async dislikePost(postId) {
        const { success, data } = await apiCall(`/posts/${postId}/dislike/`, {
            method: 'POST'
        });

        if (success) {
            this.loadPosts();
        }
    }

    async addComment(postId, content) {
        const { success, data } = await apiCall(`/posts/${postId}/comment/`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });

        if (success) {
            showMessage('نظر با موفقیت اضافه شد!');
            this.loadPostDetail(postId);
        } else {
            showMessage(data.message || 'خطا در افزودن نظر', 'error');
        }
    }

    async loadPostDetail(postId) {
        const { success, data } = await apiCall(`/posts/${postId}/`);
        
        if (success) {
            this.renderPostDetail(data.post);
        } else {
            showMessage('خطا در بارگذاری پست', 'error');
        }
    }

    renderPosts() {
        const content = document.getElementById('content');
        
        if (this.currentPosts.length === 0) {
            content.innerHTML = '<div class="text-center">پستی یافت نشد</div>';
            return;
        }

        const postsHTML = this.currentPosts.map(post => this.renderPost(post)).join('');
        content.innerHTML = `
            <div class="posts-container">
                ${postsHTML}
            </div>
        `;
    }

    renderPost(post) {
        return `
            <div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <span class="post-author">${escapeHtml(post.author)}</span>
                    <span class="post-date">${formatDate(post.created_at)}</span>
                </div>
                <div class="post-content">
                    ${escapeHtml(post.content)}
                    ${post.media.map(media => `
                        <div class="post-media">
                            <img src="${media.url}" alt="Media" style="max-width: 100%; margin-top: 1rem;">
                        </div>
                    `).join('')}
                </div>
                <div class="post-actions">
                    <button class="post-action" onclick="posts.likePost(${post.id})">
                        ❤️ ${post.likes_count}
                    </button>
                    <button class="post-action" onclick="posts.dislikePost(${post.id})">
                        👎 ${post.dislikes_count}
                    </button>
                    <button class="post-action" onclick="loadPage('post-detail', ${post.id})">
                        💬 ${post.comments_count}
                    </button>
                    <button class="post-action" onclick="posts.repost(${post.id})">
                        🔄
                    </button>
                </div>
            </div>
        `;
    }

    renderPostDetail(post) {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="posts-container">
                <div class="post">
                    <div class="post-header">
                        <span class="post-author">${escapeHtml(post.author)}</span>
                        <span class="post-date">${formatDate(post.created_at)}</span>
                    </div>
                    <div class="post-content">
                        ${escapeHtml(post.content)}
                    </div>
                    <div class="post-actions">
                        <button class="post-action" onclick="posts.likePost(${post.id})">
                            ❤️ ${post.likes_count}
                        </button>
                        <button class="post-action" onclick="posts.dislikePost(${post.id})">
                            👎 ${post.dislikes_count}
                        </button>
                    </div>
                </div>

                <div class="comment-form mt-2">
                    <h3>افزودن نظر</h3>
                    <form onsubmit="event.preventDefault(); posts.addComment(${post.id}, this.content.value)">
                        <div class="form-group">
                            <textarea name="content" placeholder="نظر خود را بنویسید..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">ارسال نظر</button>
                    </form>
                </div>

                <div class="comments mt-2">
                    <h3>نظرات (${post.comments.length})</h3>
                    ${post.comments.map(comment => `
                        <div class="comment">
                            <strong>${escapeHtml(comment.user)}</strong>
                            <span class="post-date">${formatDate(comment.created_at)}</span>
                            <p>${escapeHtml(comment.content)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

const posts = new Posts();
const API_BASE = 'http://localhost:8000/api';

// Utility functions
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const content = document.getElementById('content');
    content.insertBefore(messageDiv, content.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    };
    return headers;
}

async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            credentials: 'include',
            headers: getAuthHeaders(),
            ...options
        });
        
        const data = await response.json();
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        return { success: false, data: { message: 'Network error' }, status: 0 };
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('fa-IR');
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
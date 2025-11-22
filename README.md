# API Endpoints Reference with Example Responses

## 🔐 Authentication Endpoints

### Sign Up
```http
POST /api/signup/
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Signup successful. Please check your email to verify your account.",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile_picture": null,
        "bio": "",
        "website": "",
        "is_email_verified": false,
        "followers_count": 0,
        "following_count": 0,
        "created_at": "2023-10-15T10:30:00Z"
    }
}
```

### Login
```http
POST /api/login/
Content-Type: application/json

{
    "username_or_email": "johndoe",
    "password": "securepassword123",
    "rememberMe": true
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile_picture": "/media/profile_pictures/john.jpg",
        "bio": "Software developer",
        "website": "https://johndoe.com",
        "is_email_verified": true,
        "followers_count": 15,
        "following_count": 8,
        "created_at": "2023-10-15T10:30:00Z"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### Logout
```http
POST /api/logout/
Content-Type: application/json
Authorization: Bearer <access_token>

{
    "refresh": "<refresh_token>"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Logout successful"
}
```

### Verify Token
```http
POST /api/token/verify/
Content-Type: application/json

{
    "token": "<token_to_verify>"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Token is valid"
}
```

### Refresh Token
```http
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "<refresh_token>"
}
```

**Example Response:**
```json
{
    "success": true,
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Verify Email
```http
GET /api/verify-email/{token}/
```

**Example Response:**
```json
{
    "success": true,
    "message": "Email verified successfully",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "is_email_verified": true
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### Resend Verification Email
```http
POST /api/resend-verification-email/
Content-Type: application/json

{
    "email": "john@example.com"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Verification email sent successfully. Please check your email."
}
```

### Request Password Reset
```http
POST /api/password-reset/request/
Content-Type: application/json

{
    "email": "john@example.com"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "If this email exists in our system, a password reset link has been sent"
}
```

### Reset Password
```http
POST /api/password-reset/{token}/
Content-Type: application/json

{
    "password": "newpassword123",
    "password_confirm": "newpassword123"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Password reset successfully. You can now login."
}
```

## 👤 Profile Endpoints

### Get Current User Profile
```http
GET /api/profile/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile_picture": "/media/profile_pictures/john.jpg",
        "bio": "Software developer passionate about Django and React",
        "website": "https://johndoe.com",
        "is_email_verified": true,
        "followers_count": 15,
        "following_count": 8,
        "created_at": "2023-10-15T10:30:00Z",
        "updated_at": "2023-10-20T14:22:00Z"
    }
}
```

### Get User Public Profile
```http
GET /api/users/janesmith/profile/
```

**Example Response:**
```json
{
    "success": true,
    "user": {
        "id": 2,
        "username": "janesmith",
        "first_name": "Jane",
        "last_name": "Smith",
        "profile_picture": "/media/profile_pictures/jane.jpg",
        "bio": "UX Designer & Frontend Developer",
        "website": "https://janesmith.design",
        "is_email_verified": true,
        "followers_count": 24,
        "following_count": 12,
        "created_at": "2023-09-20T08:15:00Z"
    }
}
```

### Update Profile
```http
PUT /api/profile/update/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Smith",
    "bio": "Senior Software Developer",
    "website": "https://johnsmith.com"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Smith",
        "profile_picture": "/media/profile_pictures/john.jpg",
        "bio": "Senior Software Developer",
        "website": "https://johnsmith.com",
        "is_email_verified": true,
        "followers_count": 15,
        "following_count": 8,
        "created_at": "2023-10-15T10:30:00Z",
        "updated_at": "2023-10-25T09:45:00Z"
    }
}
```

### Update Profile Picture
```http
POST /api/profile/update-picture/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Example Response:**
```json
{
    "success": true,
    "message": "Profile picture updated successfully",
    "profile_picture": "/media/profile_pictures/new_picture.jpg"
}
```

### Delete Profile Picture
```http
DELETE /api/profile/delete-picture/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "message": "Profile picture deleted successfully"
}
```

## 🤝 Social Endpoints

### Follow User
```http
POST /api/users/janesmith/follow/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "message": "You are now following janesmith",
    "followers_count": 25
}
```

### Unfollow User
```http
POST /api/users/janesmith/unfollow/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "message": "You have unfollowed janesmith",
    "followers_count": 24
}
```

### Get User Followers
```http
GET /api/users/johndoe/followers/?page=1&per_page=20
```

**Example Response:**
```json
{
    "success": true,
    "followers": [
        {
            "id": 2,
            "username": "janesmith",
            "first_name": "Jane",
            "last_name": "Smith",
            "profile_picture": "/media/profile_pictures/jane.jpg",
            "bio": "UX Designer",
            "is_email_verified": true,
            "followers_count": 24,
            "following_count": 12
        }
    ],
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total_pages": 1,
        "total_count": 15,
        "has_next": false,
        "has_previous": false
    }
}
```

### Get User Following
```http
GET /api/users/johndoe/following/?page=1&per_page=20
```

**Example Response:**
```json
{
    "success": true,
    "following": [
        {
            "id": 3,
            "username": "mikejohnson",
            "first_name": "Mike",
            "last_name": "Johnson",
            "profile_picture": "/media/profile_pictures/mike.jpg",
            "bio": "Backend Developer",
            "is_email_verified": true,
            "followers_count": 18,
            "following_count": 7
        }
    ],
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total_pages": 1,
        "total_count": 8,
        "has_next": false,
        "has_previous": false
    }
}
```

## 📝 Post Endpoints

### Get Posts
```http
GET /api/posts/?category=tech&page=1&per_page=20
```

**Example Response:**
```json
{
    "success": true,
    "posts": [
        {
            "id": 1,
            "content": "Just launched my new Django project! 🚀",
            "author": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "profile_picture": "/media/profile_pictures/john.jpg"
            },
            "category": "tech",
            "tags": "django,programming",
            "media": [
                {
                    "id": 1,
                    "file": "/media/posts/project_screenshot.jpg",
                    "media_type": "image"
                }
            ],
            "mentions": [],
            "likes_count": 5,
            "dislikes_count": 0,
            "comments_count": 3,
            "user_reaction": "like",
            "is_saved": false,
            "created_at": "2023-10-25T10:30:00Z",
            "updated_at": "2023-10-25T10:30:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total_pages": 5,
        "total_count": 95,
        "has_next": true,
        "has_previous": false
    }
}
```

### Create Post
```http
POST /api/posts/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Example Response:**
```json
{
    "success": true,
    "post": {
        "id": 123,
        "content": "Check out this amazing sunset! 🌅",
        "author": {
            "id": 1,
            "username": "johndoe",
            "first_name": "John",
            "last_name": "Doe",
            "profile_picture": "/media/profile_pictures/john.jpg"
        },
        "category": "photography",
        "tags": "sunset,nature",
        "media": [
            {
                "id": 45,
                "file": "/media/posts/sunset_photo.jpg",
                "media_type": "image"
            }
        ],
        "mentions": [],
        "likes_count": 0,
        "dislikes_count": 0,
        "comments_count": 0,
        "user_reaction": null,
        "is_saved": false,
        "created_at": "2023-10-25T14:20:00Z",
        "updated_at": "2023-10-25T14:20:00Z"
    }
}
```

### Get Post Detail
```http
GET /api/posts/1/
```

**Example Response:**
```json
{
    "success": true,
    "post": {
        "id": 1,
        "content": "Just launched my new Django project! 🚀",
        "author": {
            "id": 1,
            "username": "johndoe",
            "first_name": "John",
            "last_name": "Doe",
            "profile_picture": "/media/profile_pictures/john.jpg"
        },
        "category": "tech",
        "tags": "django,programming",
        "media": [],
        "mentions": [],
        "likes_count": 5,
        "dislikes_count": 0,
        "comments_count": 2,
        "user_reaction": "like",
        "is_saved": true,
        "created_at": "2023-10-25T10:30:00Z",
        "updated_at": "2023-10-25T10:30:00Z",
        "comments": [
            {
                "id": 1,
                "content": "Great work! 👏",
                "user": {
                    "id": 2,
                    "username": "janesmith",
                    "first_name": "Jane",
                    "last_name": "Smith",
                    "profile_picture": "/media/profile_pictures/jane.jpg"
                },
                "likes_count": 2,
                "is_liked": false,
                "created_at": "2023-10-25T11:00:00Z"
            }
        ],
        "replies": []
    }
}
```

### Like Post
```http
POST /api/posts/1/like/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "message": "Liked",
    "likes_count": 6,
    "dislikes_count": 0,
    "user_reaction": "like"
}
```

### Dislike Post
```http
POST /api/posts/1/dislike/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "message": "Disliked",
    "likes_count": 5,
    "dislikes_count": 1,
    "user_reaction": "dislike"
}
```

### Comment on Post
```http
POST /api/posts/1/comment/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "content": "This is amazing! Great job!",
    "parent": null
}
```

**Example Response:**
```json
{
    "success": true,
    "comment": {
        "id": 3,
        "content": "This is amazing! Great job!",
        "user": {
            "id": 2,
            "username": "janesmith",
            "first_name": "Jane",
            "last_name": "Smith",
            "profile_picture": "/media/profile_pictures/jane.jpg"
        },
        "likes_count": 0,
        "is_liked": false,
        "created_at": "2023-10-25T15:30:00Z"
    },
    "comments_count": 3
}
```

### Repost
```http
POST /api/posts/1/repost/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "post": {
        "id": 124,
        "content": "Just launched my new Django project! 🚀",
        "author": {
            "id": 2,
            "username": "janesmith",
            "first_name": "Jane",
            "last_name": "Smith",
            "profile_picture": "/media/profile_pictures/jane.jpg"
        },
        "is_repost": true,
        "original_post": {
            "id": 1,
            "author": {
                "id": 1,
                "username": "johndoe"
            }
        },
        "likes_count": 0,
        "dislikes_count": 0,
        "comments_count": 0,
        "created_at": "2023-10-25T16:00:00Z"
    }
}
```

### Save Post
```http
POST /api/posts/1/save/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "message": "Post saved successfully"
}
```

### Get Saved Posts
```http
GET /api/posts/saved/?page=1&per_page=20
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "posts": [
        {
            "id": 1,
            "content": "Useful Django tips and tricks",
            "author": {
                "id": 3,
                "username": "mikejohnson",
                "first_name": "Mike",
                "last_name": "Johnson",
                "profile_picture": "/media/profile_pictures/mike.jpg"
            },
            "category": "tech",
            "likes_count": 15,
            "dislikes_count": 1,
            "comments_count": 8,
            "is_saved": true,
            "created_at": "2023-10-24T09:00:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total_pages": 1,
        "total_count": 5,
        "has_next": false,
        "has_previous": false
    }
}
```

## 🔔 Notification Endpoints

### Get Notifications
```http
GET /api/notifications/?page=1&per_page=20
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "notifications": [
        {
            "id": 1,
            "notif_type": "like",
            "message": "janesmith liked your post",
            "sender": {
                "id": 2,
                "username": "janesmith",
                "first_name": "Jane",
                "last_name": "Smith",
                "profile_picture": "/media/profile_pictures/jane.jpg"
            },
            "post": {
                "id": 1,
                "content": "Just launched my new Django project! 🚀"
            },
            "is_read": false,
            "created_at": "2023-10-25T14:30:00Z"
        },
        {
            "id": 2,
            "notif_type": "follow",
            "message": "mikejohnson started following you",
            "sender": {
                "id": 3,
                "username": "mikejohnson",
                "first_name": "Mike",
                "last_name": "Johnson",
                "profile_picture": "/media/profile_pictures/mike.jpg"
            },
            "is_read": true,
            "created_at": "2023-10-25T12:15:00Z"
        }
    ],
    "unread_count": 3,
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total_pages": 2,
        "total_count": 35,
        "has_next": true,
        "has_previous": false
    }
}
```

### Mark Notifications as Read
```http
POST /api/notifications/mark-read/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "ids": [1, 2, 3]
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Notifications marked as read"
}
```

## 💬 Messaging Endpoints

### Get Conversations
```http
GET /api/conversations/
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
    "success": true,
    "conversations": [
        {
            "id": 1,
            "participants": [
                {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "profile_picture": "/media/profile_pictures/john.jpg"
                },
                {
                    "id": 2,
                    "username": "janesmith",
                    "first_name": "Jane",
                    "last_name": "Smith",
                    "profile_picture": "/media/profile_pictures/jane.jpg"
                }
            ],
            "last_message": {
                "content": "Hey, how are you doing?",
                "sender": {
                    "id": 2,
                    "username": "janesmith"
                },
                "created_at": "2023-10-25T16:45:00Z",
                "is_read": true
            },
            "unread_count": 0,
            "updated_at": "2023-10-25T16:45:00Z"
        }
    ],
    "count": 3
}
```

### Send Message
```http
POST /api/conversations/1/send/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Example Response:**
```json
{
    "success": true,
    "message": {
        "id": 45,
        "content": "I'm doing great! Thanks for asking.",
        "sender": {
            "id": 1,
            "username": "johndoe",
            "first_name": "John",
            "last_name": "Doe",
            "profile_picture": "/media/profile_pictures/john.jpg"
        },
        "image": null,
        "file": null,
        "is_read": false,
        "created_at": "2023-10-25T17:00:00Z"
    }
}
```

## ❌ Error Responses

### Validation Error
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["This field is required."],
        "password": ["Password must be at least 8 characters."]
    }
}
```

### Authentication Error
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

### Permission Error
```json
{
    "success": false,
    "message": "You can only delete your own posts"
}
```

### Not Found Error
```json
{
    "success": false,
    "message": "User with this email does not exist."
}
```

### Server Error
```json
{
    "success": false,
    "message": "Failed to create post"
}
```

## 📋 Common Response Structure

All successful responses follow this pattern:
```json
{
    "success": true,
    "message": "Descriptive message",
    "data": { /* Endpoint-specific data */ }
}
```

All error responses follow this pattern:
```json
{
    "success": false,
    "message": "Error description",
    "errors": { /* Optional: Validation errors */ }
}
```

Pagination is included where applicable:
```json
{
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total_pages": 5,
        "total_count": 95,
        "has_next": true,
        "has_previous": false
    }
}
```
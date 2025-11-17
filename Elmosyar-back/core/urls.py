from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/verify-email/<str:token>/', views.verify_email, name='verify_email'),
    
    # Profile
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/update-picture/', views.update_profile_picture, name='update_profile_picture'),
    
    # Password Reset
    path('auth/password-reset/request/', views.request_password_reset, name='request_password_reset'),
    path('auth/password-reset/<str:token>/', views.reset_password, name='reset_password'),
    
    # Posts
    path('posts/', views.posts_list_create, name='posts_list_create'),
    path('posts/<int:post_id>/', views.post_detail, name='post_detail'),
    path('posts/<int:post_id>/thread/', views.post_thread, name='post_thread'),
    path('posts/<int:post_id>/comments/', views.post_comments, name='post_comments'),
    path('posts/category/<str:category_id>/', views.posts_by_category, name='posts_by_category'),
    path('users/<str:username>/posts/', views.user_posts, name='user_posts'),
    
    # Post Interactions
    path('posts/<int:post_id>/like/', views.post_like, name='post_like'),
    path('posts/<int:post_id>/dislike/', views.post_dislike, name='post_dislike'),
    path('posts/<int:post_id>/comment/', views.post_comment, name='post_comment'),
    path('posts/<int:post_id>/repost/', views.post_repost, name='post_repost'),
    
    # Notifications
    path('notifications/', views.notifications_list, name='notifications_list'),
    path('notifications/mark-read/', views.notifications_mark_read, name='notifications_mark_read'),
]
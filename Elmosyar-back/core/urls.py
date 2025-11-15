from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/signup/', views.signup, name='signup'),
    path('api/login/', views.login_user, name='login'),
    path('api/logout/', views.logout_user, name='logout'),
    path('api/verify-email/<str:token>/', views.verify_email, name='verify_email'),
    path('api/profile/', views.get_profile, name='get_profile'),
    path('api/profile/update/', views.update_profile, name='update_profile'),
    path('api/password-reset/request/', views.request_password_reset, name='request_password_reset'),
    path('api/password-reset/<str:token>/', views.reset_password, name='reset_password'),
]

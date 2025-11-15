from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
import json
from datetime import timedelta

from .models import User


@require_http_methods(["GET"])
def index(request):
    return render(request, "index.html")


@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        password_confirm = data.get('password_confirm', '')

        if not all([username, email, password, password_confirm]):
            return JsonResponse({
                'success': False,
                'message': 'All fields are required'
            }, status=400)

        if not email.endswith('@iust.ac.ir'):
            return JsonResponse({
                'success': False,
                'message': 'Email must be from iust.ac.ir domain'
            }, status=400)

        if password != password_confirm:
            return JsonResponse({
                'success': False,
                'message': 'Passwords do not match'
            }, status=400)

        if len(password) < 8:
            return JsonResponse({
                'success': False,
                'message': 'Password must be at least 8 characters'
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'success': False,
                'message': 'Username already exists'
            }, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'success': False,
                'message': 'Email already exists'
            }, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=False
        )

        verification_token = user.generate_email_verification_token()
        user.email_verification_sent_at = timezone.now()
        user.save()

        verification_link = f"{request.build_absolute_uri('/')}/verify-email/{verification_token}/"
        send_mail(
            'Email Verification',
            f'Click this link to verify your email: {verification_link}',
            settings.DEFAULT_FROM_EMAIL or 'noreply@example.com',
            [user.email],
            fail_silently=True,
        )

        return JsonResponse({
            'success': True,
            'message': 'Signup successful. Please check your email to verify your account.',
            'user_id': user.id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def verify_email(request, token):
    try:
        user = get_object_or_404(User, email_verification_token=token)

        token_age = timezone.now() - user.email_verification_sent_at
        if token_age > timedelta(hours=24):
            return JsonResponse({
                'success': False,
                'message': 'Verification token has expired'
            }, status=400)

        user.verify_email()
        user.is_active = True
        user.save()

        return JsonResponse({
            'success': True,
            'message': 'Email verified successfully. You can now login.'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body)
        username_or_email = data.get('username_or_email', '').strip()
        password = data.get('password', '')

        if not all([username_or_email, password]):
            return JsonResponse({
                'success': False,
                'message': 'Username/Email and password are required'
            }, status=400)

        user = User.objects.filter(
            email=username_or_email
        ).first() or User.objects.filter(
            username=username_or_email
        ).first()

        if user and user.check_password(password):
            if not user.is_active:
                return JsonResponse({
                    'success': False,
                    'message': 'Please verify your email first'
                }, status=400)

            login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid credentials'
            }, status=401)

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@require_http_methods(["POST"])
def logout_user(request):
    logout(request)
    return JsonResponse({
        'success': True,
        'message': 'Logout successful'
    })


@require_http_methods(["GET"])
def get_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            'success': False,
            'message': 'User not authenticated'
        }, status=401)

    user = request.user
    return JsonResponse({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'student_id': user.student_id,
            'bio': user.bio,
            'is_email_verified': user.is_email_verified,
        }
    })


@csrf_exempt
@require_http_methods(["PUT", "POST"])
def update_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            'success': False,
            'message': 'User not authenticated'
        }, status=401)

    try:
        data = json.loads(request.body)
        user = request.user

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'student_id' in data:
            user.student_id = data['student_id']
        if 'bio' in data:
            user.bio = data['bio']

        user.save()

        return JsonResponse({
            'success': True,
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'student_id': user.student_id,
                'bio': user.bio,
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def request_password_reset(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()

        if not email:
            return JsonResponse({
                'success': False,
                'message': 'Email is required'
            }, status=400)

        user = User.objects.filter(email=email).first()

        if user:
            reset_token = user.generate_password_reset_token()
            user.password_reset_sent_at = timezone.now()
            user.save()

            reset_link = f"{request.build_absolute_uri('/')}/reset-password/{reset_token}/"
            send_mail(
                'Password Reset Request',
                f'Click this link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL or 'noreply@example.com',
                [user.email],
                fail_silently=True,
            )

        return JsonResponse({
            'success': True,
            'message': 'If this email exists, a password reset link has been sent'
        })

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request, token):
    try:
        user = get_object_or_404(User, password_reset_token=token)

        token_age = timezone.now() - user.password_reset_sent_at
        if token_age > timedelta(hours=1):
            return JsonResponse({
                'success': False,
                'message': 'Password reset token has expired'
            }, status=400)

        data = json.loads(request.body)
        password = data.get('password', '')
        password_confirm = data.get('password_confirm', '')

        if not all([password, password_confirm]):
            return JsonResponse({
                'success': False,
                'message': 'Password and confirmation are required'
            }, status=400)

        if password != password_confirm:
            return JsonResponse({
                'success': False,
                'message': 'Passwords do not match'
            }, status=400)

        if len(password) < 8:
            return JsonResponse({
                'success': False,
                'message': 'Password must be at least 8 characters'
            }, status=400)

        user.set_password(password)
        user.password_reset_token = None
        user.password_reset_sent_at = None
        user.save()

        return JsonResponse({
            'success': True,
            'message': 'Password reset successfully. You can now login.'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Elmosyar-back.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if len(sys.argv) < 2:
    print("Usage: python make_superuser.py <username>")
    print("Example: python make_superuser.py john_doe")
    sys.exit(1)

username = sys.argv[1]

try:
    user = User.objects.get(username=username)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"✓ User '{username}' has been promoted to superuser!")
except User.DoesNotExist:
    print(f"✗ User '{username}' not found")
    sys.exit(1)
except Exception as e:
    print(f"✗ Error: {str(e)}")
    sys.exit(1)

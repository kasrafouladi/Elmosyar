import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Elmosyar-back.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    user_count = User.objects.count()
    print(f"Deleting {user_count} users...")
    
    User.objects.all().delete()
    
    remaining = User.objects.count()
    print(f"✓ All users have been deleted!")
    print(f"✓ Remaining users: {remaining}")
except Exception as e:
    print(f"✗ Error: {str(e)}")

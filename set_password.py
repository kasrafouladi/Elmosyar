import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Elmosyar-back.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(username='A')
user.set_password('12345678')
user.save()
print(f"Password updated for user: {user.username}")

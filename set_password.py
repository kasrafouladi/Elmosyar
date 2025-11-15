import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Elmosyar-back.settings')
django.setup()

from django.contrib.auth import get_user_model

username = input("username: ")
password = input("password: ")

User = get_user_model()
user = User.objects.get(username=username)
user.set_password(password)
user.save()
print(f"Password updated for user: {user.username}")

from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
import random
import string


class User(AbstractUser):
    email = models.EmailField(unique=True)
    student_id = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)
    password_reset_token = models.CharField(max_length=255, blank=True, null=True)
    password_reset_sent_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username

    def generate_email_verification_token(self):
        self.email_verification_token = str(uuid.uuid4())
        return self.email_verification_token

    def generate_password_reset_token(self):
        self.password_reset_token = str(uuid.uuid4())
        return self.password_reset_token

    def verify_email(self):
        self.is_email_verified = True
        self.email_verification_token = None
        self.save()

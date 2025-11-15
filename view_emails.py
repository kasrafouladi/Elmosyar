import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
EMAILS_DIR = BASE_DIR / 'sent_emails'

def view_emails():
    """View all sent emails from the file-based email backend"""
    
    if not EMAILS_DIR.exists():
        print("❌ No 'sent_emails' directory found.")
        print("📝 Make sure EMAIL_BACKEND is set to 'django.core.mail.backends.filebased.EmailBackend'")
        print(f"📁 Expected path: {EMAILS_DIR}")
        return
    
    email_files = sorted(EMAILS_DIR.glob('*.log'))
    
    if not email_files:
        print("📬 No emails found in sent_emails directory")
        return
    
    print(f"\n📧 Found {len(email_files)} email(s):\n")
    print("=" * 80)
    
    for idx, email_file in enumerate(email_files, 1):
        print(f"\n📨 Email #{idx}: {email_file.name}")
        print("-" * 80)
        
        with open(email_file, 'r') as f:
            content = f.read()
            print(content)
        
        print("=" * 80)

if __name__ == '__main__':
    view_emails()

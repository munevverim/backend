from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from .models import CustomUser

@receiver(user_logged_in, sender=User)
def set_initial_credit(sender, user, request, **kwargs):
    custom_user, created = CustomUser.objects.get_or_create(
        id=user.id,
        defaults={
            'credit': 200,
            'email': user.email,
            'username': user.username,
            'is_subscribed': True,
            't1': '', 't2': '', 't3': '', 't4': '', 't5': '',
            't6': '', 't7': '', 't8': '', 't9': '', 't10': '',
            'c1': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c2': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c3': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c4': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c5': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c6': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c7': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c8': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c9': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []},
            'c10': {"width": 768, "height": 768, 'lastLayerCounter': 0, "objects": []}
        }
    )
    if created:
        custom_user.save()
        unsubscribe_url = f"http://127.0.0.1:8000/unsubscribe/"
        context = {
            'username': user.username,
            'unsubscribe_url': unsubscribe_url
        }
        email_subject = 'Welcome to Quick Vision Studios'
        email_body = render_to_string('welcome_mail.html', context)
        
        email = EmailMessage(
            email_subject,
            email_body,
            'quickvisionai@gmail.com',
            [user.email],
        )
        email.content_subtype = 'html'
        email.send(fail_silently=False)
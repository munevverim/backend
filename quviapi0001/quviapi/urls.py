from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from .views import GoogleSignInView

urlpatterns = [
    path("", views.index, name="index"),
    path("index/", views.index, name="index"),
    path('project/editor/', views.editor, name="editor"),
    path('project/editor-free/', views.editorFree, name="editor-free"),
    path("project/editor/background_cleaner",views.background_cleaner, name="background_cleaner"),
    path("project/editor-free/background_cleaner",views.background_cleaner, name="background_cleaner"),
    path("project/editor/remove_objects",views.remove_objects, name="remove_objects"),
    path("project/editor-free/remove_objects",views.remove_objects, name="remove_objects"),
    path("project/editor/generate_canvas",views.generate_canvas, name="generate_canvas"),
    path("project/editor-free/generate_canvas",views.generate_canvas, name="generate_canvas"),
    path("project/editor/download_image",views.download_image, name="download_image"),
    path("project/editor-free/download_image",views.download_image, name="download_image"),
    path("project/", views.projectChoose, name="project"),
    path("about-us/", views.about_us, name="about-us"),
    path("term-of-use/", views.term_of_use, name="term-of-use"),
    path("pricing/", views.pricing, name="pricing"),
    path("contact/", views.contact, name="contact"),
    path("privacy-policy/", views.privacy_policy, name="privacy-policy"),
    path("userInfo/", views.userInfo, name="userInfo"),
    path("project/editor/save_canvas_data", views.save_canvas_data, name="save_canvas_data"),
    path("project/editor-free/save_canvas_data", views.save_canvas_data, name="save_canvas_data"),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('get-csrf-token/', views.get_csrf_token, name='get-csrf-token'),
    path('unsubscribe/', views.unsubscribe, name='unsubscribe'),
    path('send_bulk_emails/', views.send_bulk_emails_view, name='send_bulk_emails'),
    path('email_sent_success/', views.email_sent_success_view, name='email_sent_success'),
    path('google-signin/', GoogleSignInView.as_view(), name='google-signin'),
    path('generate-image/', views.generate_image, name='generate-image'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

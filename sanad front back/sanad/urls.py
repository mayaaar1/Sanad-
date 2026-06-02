from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView  # 👈 Import this to render your HTML page
from core.views import register_restaurant

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 🏠 This line maps the empty home path to your index.html file!
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    
    # ⚙️ This handles your frontend JavaScript registration form
    path('api/auth/register/', register_restaurant, name='register_restaurant'),
]
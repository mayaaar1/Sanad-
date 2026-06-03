from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView  # 👈 Import this to render your HTML page
# from core.views import register_restaurant, login_user, create_offer, list_offers, my_offers, dashboard, create_reservation, my_reservations

# urlpatterns = [
#     path('admin/', admin.site.urls),
    
#     # 🏠 This line maps the empty home path to your index.html file!
#     path('', TemplateView.as_view(template_name='index.html'), name='home'),
    
#     # ⚙️ This handles your frontend JavaScript registration form
#     path('api/auth/register/', register_restaurant, name='register_restaurant'),
#     path('api/auth/login/', login_user, name='login_user'),

#     #this one is for the offers
#     path('api/offers/create/', create_offer, name='create_offer'), 

#     path('api/offers/', list_offers),        # ← feed + home grid
#     path('api/offers/mine/', my_offers),     # ← "Mes offres" tab
#     path('api/dashboard/', dashboard),       # ← Vue d'ensemble

#     path('api/reservations/', create_reservation),   # ← POST to reserve
#     path('api/reservations/mine/', my_reservations), # ← GET consumer's reservations

# ]


from core.views import (
    register_restaurant, login_user, create_offer, list_offers,
    my_offers, dashboard, create_reservation, my_reservations,
    global_impact, offer_detail, leaderboard, predictions, seed,
    dynamic_pricing
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('api/auth/register/', register_restaurant),
    path('api/auth/login/', login_user),
    path('api/offers/create/', create_offer),
    path('api/offers/mine/', my_offers),
    path('api/offers/<int:offer_id>/', offer_detail),   # ← must be after /mine/
    path('api/offers/', list_offers),
    path('api/dashboard/', dashboard),
    path('api/reservations/', create_reservation),
    path('api/reservations/mine/', my_reservations),
    path('api/impact/', global_impact),
    path('api/leaderboard/', leaderboard),
    path('api/predictions/', predictions),
    path('api/predictions/generate/', predictions),     # POST → same view
    path('api/pricing/', dynamic_pricing),              # ✅ Tarification dynamique Khadidja
    path('api/seed/', seed),
]
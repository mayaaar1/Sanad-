import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Restaurant, Offer, Reservation

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

@csrf_exempt
def register_restaurant(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'consumer')
            restaurant_name = data.get('restaurant_name')
            address = data.get('address', '')

            if not username or not password:
                return JsonResponse({'detail': 'Champs obligatoires manquants.'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'detail': 'Ce nom d\'utilisateur existe déjà.'}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role
            )

            if role == 'restaurant':
                if not restaurant_name:
                    user.delete()
                    return JsonResponse({'detail': 'Le nom du restaurant est obligatoire.'}, status=400)
                Restaurant.objects.create(
                    user=user,
                    name=restaurant_name,
                    address=address,
                    lat=35.704,
                    lng=-0.624,
                    cuisine_type=data.get('cuisine_type', '')
                )

            # ✅ Return token + user so the frontend can log in immediately
            token = get_tokens_for_user(user)
            return JsonResponse({
                'access': token,
                'user': {'username': user.username, 'role': user.role}
            }, status=201)

        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Méthode non autorisée.'}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)
            if user is None:
                return JsonResponse({'error': 'Identifiants incorrects.'}, status=401)

            token = get_tokens_for_user(user)
            return JsonResponse({
                'access': token,
                'user': {'username': user.username, 'role': user.role}
            })

        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Méthode non autorisée.'}, status=405)





@csrf_exempt
def create_offer(request):
    if request.method == 'POST':
        try:
            auth = JWTAuthentication()
            user_auth = auth.authenticate(request)
            if user_auth is None:
                return JsonResponse({'detail': 'Non authentifié.'}, status=401)
            user, _ = user_auth

            if user.role != 'restaurant':
                return JsonResponse({'detail': 'Accès refusé.'}, status=403)

            restaurant = Restaurant.objects.get(user=user)
            data = json.loads(request.body)

            offer = Offer.objects.create(
                restaurant=restaurant,
                title=data.get('title'),
                description=data.get('description', ''),
                original_price=data.get('original_price'),
                current_price=data.get('current_price'),       # matches your HTML
                quantity_total=data.get('quantity_total', 1),
                quantity_remaining=data.get('quantity_remaining', 1),
                category=data.get('category', ''),
                status=data.get('status', 'active'),
                expires_at=data.get('expires_at'),
            )
            return JsonResponse({'detail': 'Offre publiée.', 'id': offer.id}, status=201)

        except Restaurant.DoesNotExist:
            return JsonResponse({'detail': 'Restaurant introuvable.'}, status=404)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Méthode non autorisée.'}, status=405)


@csrf_exempt
def dashboard(request):
    auth = JWTAuthentication()
    user_auth = auth.authenticate(request)
    if user_auth is None:
        return JsonResponse({'detail': 'Non authentifié.'}, status=401)
    user, _ = user_auth

    try:
        restaurant = Restaurant.objects.get(user=user)
        offers = Offer.objects.filter(restaurant=restaurant)
        active = offers.filter(status='active').count()
        saved = offers.filter(status='saved').count()
        total = offers.count()
        save_rate = round((saved / total) * 100) if total > 0 else 0

        recent = list(offers.order_by('-created_at')[:5].values(
            'title', 'status', 'quantity_total', 'quantity_remaining', 'current_price'
        ))

        return JsonResponse({
            'stats': {
                'active_offers': active,
                'meals_saved': saved,
                'save_rate': save_rate,
                'co2_saved_kg': round(saved * 1.25, 1),
                'kg_saved': round(saved * 0.5, 1),
                'water_saved_liters': saved * 1000,
            },
            'recent_offers': recent
        })
    except Restaurant.DoesNotExist:
        return JsonResponse({'detail': 'Restaurant introuvable.'}, status=404)


@csrf_exempt
def my_offers(request):
    auth = JWTAuthentication()
    user_auth = auth.authenticate(request)
    if user_auth is None:
        return JsonResponse({'detail': 'Non authentifié.'}, status=401)
    user, _ = user_auth

    try:
        from django.utils import timezone as tz
        restaurant = Restaurant.objects.get(user=user)
        offers_qs = Offer.objects.filter(restaurant=restaurant).order_by('-created_at')
        offers = []
        for o in offers_qs:
            mins = max(0, int((o.expires_at - tz.now()).total_seconds() / 60))
            offers.append({
                'id': o.id,
                'title': o.title,
                'status': o.status,
                'current_price': float(o.current_price),
                'original_price': float(o.original_price),
                'quantity_total': o.quantity_total,
                'quantity_remaining': o.quantity_remaining,
                'category': o.category,
                'expires_at': o.expires_at.isoformat(),
                'minutes_left': mins,
            })
        return JsonResponse(offers, safe=False)
    except Restaurant.DoesNotExist:
        return JsonResponse({'detail': 'Restaurant introuvable.'}, status=404)


def list_offers(request):
    from django.utils import timezone
    offers = Offer.objects.filter(status='active', expires_at__gt=timezone.now())
    category = request.GET.get('category')
    if category:
        offers = offers.filter(category=category)

    data = []
    for o in offers.select_related('restaurant'):
        mins_left = max(0, int((o.expires_at - timezone.now()).total_seconds() / 60))
        orig = float(o.original_price)
        curr = float(o.current_price)
        discount = round((orig - curr) / orig * 100) if orig > 0 else 0
        data.append({
            'id': o.id,
            'title': o.title,
            'description': o.description,
            'original_price': orig,
            'current_price': curr,
            'discount_percent': discount,
            'quantity_remaining': o.quantity_remaining,
            'category': o.category,
            'status': o.status,
            'minutes_left': mins_left,
            'restaurant_name': o.restaurant.name,
            'restaurant_lat': o.restaurant.lat,
            'restaurant_lng': o.restaurant.lng,
            'photo_url': o.photo_url if o.photo_url else '',
        })
    return JsonResponse(data, safe=False)


@csrf_exempt
def create_reservation(request):
    if request.method == 'POST':
        try:
            auth = JWTAuthentication()
            user_auth = auth.authenticate(request)
            if user_auth is None:
                return JsonResponse({'detail': 'Non authentifié.'}, status=401)
            user, _ = user_auth

            if user.role != 'consumer':
                return JsonResponse({'detail': 'Seuls les consommateurs peuvent réserver.'}, status=403)

            data = json.loads(request.body)
            offer_id = data.get('offer')
            quantity = data.get('quantity', 1)

            offer = Offer.objects.get(id=offer_id)

            if offer.status != 'active':
                return JsonResponse({'detail': 'Cette offre n\'est plus disponible.'}, status=400)
            if offer.quantity_remaining < quantity:
                return JsonResponse({'detail': 'Quantité insuffisante.'}, status=400)

            reservation = Reservation.objects.create(
                user=user,
                offer=offer,
                quantity=quantity,
                status='confirmed'
            )

            # Update offer quantity
            offer.quantity_remaining -= quantity
            if offer.quantity_remaining == 0:
                offer.status = 'reserved'
            offer.save()

            return JsonResponse({'detail': 'Réservation confirmée.', 'id': reservation.id}, status=201)

        except Offer.DoesNotExist:
            return JsonResponse({'detail': 'Offre introuvable.'}, status=404)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Méthode non autorisée.'}, status=405)


@csrf_exempt
def my_reservations(request):
    auth = JWTAuthentication()
    user_auth = auth.authenticate(request)
    if user_auth is None:
        return JsonResponse({'detail': 'Non authentifié.'}, status=401)
    user, _ = user_auth

    reservations = Reservation.objects.filter(user=user).select_related('offer__restaurant').order_by('-created_at')
    data = [{
        'id': r.id,
        'offer_title': r.offer.title,
        'restaurant_name': r.offer.restaurant.name,
        'quantity': r.quantity,
        'status': r.status,
        'created_at': r.created_at.isoformat(),
    } for r in reservations]

    return JsonResponse(data, safe=False)


# ── Global impact (home page counters) ───────────────────────────
def global_impact(request):
    from django.utils import timezone
    total_saved = Reservation.objects.filter(status='confirmed').count()
    return JsonResponse({
        'meals_saved': total_saved,
        'co2_saved_kg': round(total_saved * 1.25, 1),
        'water_saved_liters': total_saved * 1000,
        'kg_saved': round(total_saved * 0.5, 1),
    })


# ── Single offer detail ───────────────────────────────────────────
def offer_detail(request, offer_id):
    from django.utils import timezone
    try:
        o = Offer.objects.select_related('restaurant').get(id=offer_id)
        mins_left = max(0, int((o.expires_at - timezone.now()).total_seconds() / 60))
        orig = float(o.original_price)
        curr = float(o.current_price)
        discount = round((orig - curr) / orig * 100) if orig > 0 else 0
        return JsonResponse({
            'id': o.id,
            'title': o.title,
            'description': o.description,
            'original_price': orig,
            'current_price': curr,
            'discount_percent': discount,
            'quantity_remaining': o.quantity_remaining,
            'category': o.category,
            'status': o.status,
            'minutes_left': mins_left,
            'restaurant_name': o.restaurant.name,
            'restaurant_lat': o.restaurant.lat,
            'restaurant_lng': o.restaurant.lng,
            'photo_url': o.photo_url,
        })
    except Offer.DoesNotExist:
        return JsonResponse({'detail': 'Introuvable.'}, status=404)


# ── Leaderboard ───────────────────────────────────────────────────
def leaderboard(request):
    restaurants = Restaurant.objects.all()
    data = []
    for r in restaurants:
        meals = Reservation.objects.filter(offer__restaurant=r, status='confirmed').count()
        data.append({
            'name': r.name,
            'cuisine_type': r.cuisine_type,
            'meals_saved': meals,
            'kg_saved': round(meals * 0.5, 1),
        })
    data.sort(key=lambda x: x['meals_saved'], reverse=True)
    return JsonResponse(data, safe=False)


# ── Predictions — Modèles IA de Khadidja (dataset Kaggle) ────────
@csrf_exempt
def predictions(request):
    auth = JWTAuthentication()
    user_auth = auth.authenticate(request)
    if user_auth is None:
        return JsonResponse({'detail': 'Non authentifié.'}, status=401)
    user, _ = user_auth

    try:
        from django.utils import timezone
        from datetime import timedelta
        from .ai_engine import get_waste_predictor, get_recommendation_engine

        restaurant = Restaurant.objects.get(user=user)
        offers_qs = Offer.objects.filter(restaurant=restaurant).order_by('-created_at')[:5]

        waste_predictor = get_waste_predictor()
        now = timezone.now()

        preds = []
        offers_data = []

        for o in offers_qs:
            mins_left = max(0, int((o.expires_at - now).total_seconds() / 60))
            offer_data = {
                'title': o.title,
                'category': o.category,
                'original_price': float(o.original_price),
                'current_price': float(o.current_price),
                'quantity_total': o.quantity_total,
                'quantity_remaining': o.quantity_remaining,
                'minutes_left': mins_left,
            }
            offers_data.append(offer_data)

            # Prédiction gaspillage via modèle Khadidja (Random Forest Kaggle)
            waste_result = waste_predictor.predict(offer_data, now.replace(tzinfo=None))

            pred_date = (now + timedelta(days=1)).strftime('%Y-%m-%d')

            preds.append({
                'dish_name': o.title,
                'predicted_date': pred_date,
                # ✅ Vrai modèle IA Khadidja — plus de random.uniform !
                'predicted_waste_kg': waste_result['predicted_waste_kg'],
                'risk_level': waste_result['risk_level'],
                'confidence_score': waste_result['confidence_score'],
                'model_name': waste_result['model_name'],
                'r2_score': waste_result['r2_score'],
            })

        # Recommandations globales
        rec_engine = get_recommendation_engine()
        waste_preds = [p for p in preds]
        recommendations = rec_engine.recommend(offers_data, waste_preds)

        return JsonResponse({
            'predictions': preds,
            'recommendations': recommendations,
            'ai_info': {
                'model': waste_predictor.model_name,
                'dataset': 'Kaggle - Dynamic Food Waste Forecasting for Smart Cities',
                'features_used': len(waste_predictor.features),
                'r2_score': round(waste_predictor.r2_score, 3),
                'mae_kg': round(waste_predictor.mae / 1000, 3),
            }
        }, safe=False)

    except Restaurant.DoesNotExist:
        return JsonResponse({'predictions': [], 'recommendations': {}}, safe=False)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"[predictions] Error: {e}", exc_info=True)
        return JsonResponse({'detail': str(e)}, status=500)


# ── Dynamic Pricing — Modèle Khadidja ─────────────────────────────
@csrf_exempt
def dynamic_pricing(request):
    auth = JWTAuthentication()
    user_auth = auth.authenticate(request)
    if user_auth is None:
        return JsonResponse({'detail': 'Non authentifié.'}, status=401)
    user, _ = user_auth

    try:
        from django.utils import timezone
        from .ai_engine import get_pricing_engine

        restaurant = Restaurant.objects.get(user=user)
        offers_qs = Offer.objects.filter(restaurant=restaurant, status='active').order_by('-created_at')

        pricing_engine = get_pricing_engine()
        now = timezone.now()
        results = []

        for o in offers_qs:
            mins_left = max(0, int((o.expires_at - now).total_seconds() / 60))
            offer_data = {
                'original_price': float(o.original_price),
                'current_price': float(o.current_price),
                'quantity_total': o.quantity_total,
                'quantity_remaining': o.quantity_remaining,
                'minutes_left': mins_left,
            }
            pricing = pricing_engine.compute_price(offer_data)
            results.append({
                'offer_id': o.id,
                'title': o.title,
                **pricing,
            })

        return JsonResponse(results, safe=False)

    except Restaurant.DoesNotExist:
        return JsonResponse([], safe=False)
    except Exception as e:
        return JsonResponse({'detail': str(e)}, status=500)


# ── Seed (no-op, just prevents 404 errors on startup) ────────────
@csrf_exempt
def seed(request):
    return JsonResponse({'detail': 'ok'})







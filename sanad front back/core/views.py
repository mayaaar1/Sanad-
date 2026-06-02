import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import Restaurant

User = get_user_model()

@csrf_exempt
def register_restaurant(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # 1. Fetch form credentials from index.html
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'consumer') # Fallback to consumer if role isn't explicitly sent
            
            restaurant_name = data.get('restaurant_name')
            address = data.get('address', '')

            if not username or not password:
                return JsonResponse({'detail': 'Champs obligatoires manquants.'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'detail': 'Ce nom d\'utilisateur existe déjà.'}, status=400)

            # 2. Build out the base user account row
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role
            )

            # 3. Only attempt to populate a restaurant profile row if the user chose 'restaurant'
            if role == 'restaurant':
                if not restaurant_name:
                    user.delete() # Clean up base user account row if invalid
                    return JsonResponse({'detail': 'Le nom du restaurant est obligatoire.'}, status=400)
                
                Restaurant.objects.create(
                    user=user,
                    name=restaurant_name,
                    address=address,
                    lat=35.704,  # Fallback Oran map coordinates
                    lng=-0.624,
                    cuisine_type=data.get('cuisine_type', '')
                )

            return JsonResponse({'ok': True, 'message': 'Compte créé avec succès !'}, status=201)

        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)
            
    return JsonResponse({'detail': 'Méthode non autorisée.'}, status=405)
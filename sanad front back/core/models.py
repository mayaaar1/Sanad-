
from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Custom User Model matching your schema [cite: 42]
class User(AbstractUser):
    ROLE_CHOICES = (
        ('restaurant', 'Restaurant'),
        ('consumer', 'Consumer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
            'auth.Group',
            related_name='custom_user_groups',
            blank=True,
            help_text='The groups this user belongs to.',
            verbose_name='groups',
        )
    user_permissions = models.ManyToManyField(
            'auth.Permission',
            related_name='custom_user_permissions',
            blank=True,
            help_text='Specific permissions for this user.',
            verbose_name='user permissions',
        )

# 2. Restaurants table [cite: 43]
class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='restaurant_profile')
    name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    lat = models.FloatField()
    lng = models.FloatField()
    cuisine_type = models.CharField(max_length=100, blank=True)
    avg_waste_kg = models.FloatField(default=0.0)

    def __str__(self):
        return self.name

# 3. Offers table [cite: 44, 45]
class Offer(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('reserved', 'Reserved'),
        ('expired', 'Expired'),
        ('saved', 'Saved'),
    )
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='offers')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_total = models.IntegerField()
    quantity_remaining = models.IntegerField()
    photo_url = models.URLField(blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.title} - {self.restaurant.name}"

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models


class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "is_active", "date_joined", "credits", 'avatar')
    ordering = ("username", "date_joined")
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('avatar', 'credits')}),
    )


admin.site.register(models.CustomUser, CustomUserAdmin)


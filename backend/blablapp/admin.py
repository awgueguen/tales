from django.contrib import admin
from .models import MyUser, Entity, EntityInstance

# test ---------------------------------------------------------------------- #


class MyUserAdmin(admin.ModelAdmin):
    list_display = ["unique_id"]


class EntityAdmin(admin.ModelAdmin):
    list_display = ["name"]


class EntityInstanceAdmin(admin.ModelAdmin):
    list_display = ["name"]


admin.site.register(MyUser, MyUserAdmin)
admin.site.register(Entity, EntityAdmin)
admin.site.register(EntityInstance, EntityInstanceAdmin)

# end ----------------------------------------------------------------------- #

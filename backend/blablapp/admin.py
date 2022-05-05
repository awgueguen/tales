import contextlib
from re import A
from django.contrib import admin
from django.apps import apps

# test ---------------------------------------------------------------------- #

""" 
class MyUserAdmin(admin.ModelAdmin):
    list_display = ["unique_id"]


class EntityAdmin(admin.ModelAdmin):
    list_display = ["name"]


class EntityInstanceAdmin(admin.ModelAdmin):
    list_display = ["name"]


admin.site.register(MyUser, MyUserAdmin)
# admin.site.register(Entity, EntityAdmin)
admin.site.register(EntityInstance, EntityInstanceAdmin)
 """

models = apps.get_models()

for model in models:
    with contextlib.suppress(admin.sites.AlreadyRegistered):
        admin.site.register(model)

# end ----------------------------------------------------------------------- #

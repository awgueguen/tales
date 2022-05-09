import contextlib
from django.contrib import admin
from django.apps import apps

# test ---------------------------------------------------------------------- #

models = apps.get_models()

for model in models:
    with contextlib.suppress(admin.sites.AlreadyRegistered):
        admin.site.register(model)

# end ----------------------------------------------------------------------- #

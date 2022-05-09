"""
WSGI config for socketio_server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""
from socketio import WSGIApp
from socketio_app.views import sio
import os
import eventlet

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socketio_server.settings')

django_app = get_wsgi_application()
application = WSGIApp(sio, django_app)

eventlet.wsgi.server(eventlet.listen(('', 8000)), application)

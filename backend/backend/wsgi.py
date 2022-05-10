"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import eventlet
import os
import socketio
from django.core.wsgi import get_wsgi_application
from chat.views import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()
application = socketio.WSGIApp(sio)
eventlet.wsgi.server(eventlet.listen(('', 8000)), application)

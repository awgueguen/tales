"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import os
# import socketio
from socketio import WSGIApp
from django.core.wsgi import get_wsgi_application
from chat.views import sio

from django.contrib.staticfiles.handlers import StaticFilesHandler
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = get_wsgi_application()
# application = socketio.WSGIApp(sio)


django_app = StaticFilesHandler(get_wsgi_application())
application = WSGIApp(sio, wsgi_app=django_app, socketio_path='socket.io')

import eventlet
eventlet.wsgi.server(eventlet.listen(('', 8000)), application)


# from django.core.wsgi import get_wsgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socketio_server.settings')

# django_app = get_wsgi_application()
# application = WSGIApp(sio, django_app)

# eventlet.wsgi.server(eventlet.listen(('', 8000)), application)
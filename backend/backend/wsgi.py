import eventlet
import os
from socketio import WSGIApp
from django.core.wsgi import get_wsgi_application
from chat.views import sio

from django.contrib.staticfiles.handlers import StaticFilesHandler
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


django_app = StaticFilesHandler(get_wsgi_application())
application = WSGIApp(sio, wsgi_app=django_app)

eventlet.wsgi.server(eventlet.listen(('', 8000)), application)

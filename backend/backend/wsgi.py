# OK ------------------------------------------------------------------------ #

import eventlet
import os
from django.core.wsgi import get_wsgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler
from socketio import WSGIApp
from websocket.views import sio


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_app = StaticFilesHandler(get_wsgi_application())
application = WSGIApp(sio, wsgi_app=django_app)

eventlet.wsgi.server(eventlet.listen(
    ('', int(os.environ.get('PORT', '8000')))), application)

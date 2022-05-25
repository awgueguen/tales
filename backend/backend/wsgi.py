import eventlet
import os
# import socketio
from socketio import WSGIApp
from django.core.wsgi import get_wsgi_application
from chat.views import sio

from django.contrib.staticfiles.handlers import StaticFilesHandler
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_app = StaticFilesHandler(get_wsgi_application())
application = WSGIApp(sio, wsgi_app=django_app)

# eventlet.wsgi.server(eventlet.listen(('', 8000)), application)
# _______version qui fonctionnait avant heroku_________________

# socketio.run(app, port=int(os.environ.get('PORT', '5000'))) 
# ______________exemple Flask___________________________________

eventlet.wsgi.server(eventlet.listen(('', int(os.environ.get('PORT', '8000')))), application)

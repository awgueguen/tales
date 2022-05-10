import socketio
from django.http import HttpResponse, JsonResponse
import os
from django.shortcuts import render

# Create your views here.
async_mode = None
# async_mode = 'eventlet'


# basedir = os.path.dirname(os.path.realpath(__file__))
sio = socketio.Server(async_mode='eventlet',
                      cors_allowed_origins='http://localhost:3000')
thread = None

# app = socketio.WSGIApp(sio)
# import eventlet
# eventlet.wsgi.server(eventlet.listen(('', 8000)), app)

# def background_thread():
#     """Example of how to send server generated events to clients."""
#     count = 0
#     while True:
#         sio.sleep(10)
#         count += 1
#         sio.emit('my_response', {'data': 'Server generated event'},
#                 namespace='/test')


def index(request):
    # for key in list(request.__dict__.keys()):
    #     print(key, end=":")
    #     print(request.__dict__[key])
    # print(request.get_signed_cookie('SID'))
    # global thread
    # if thread is None:
    #     thread = sio.start_background_task(background_thread)
    # return HttpResponse(open(os.path.join(basedir, 'static/index.html')))
    # return HttpResponse(open(os.path.join(basedir, '../frontend/public/index.html')))y
    # return HttpResponse(open('/home/techfront2/Documents/theo/techfront/Projet_programme/blablapp/donjon_et_couillon/frontend/public/index.html'))

    @sio.event()  # namespace='/dung'
    def my_event(sid, message):
        print('coucou', sid)
        print('msg', message)
        sio.emit('my_response', {'data': message['data']})  # room=sid

    # send()
    @sio.event()
    def my_broadcast_event(sid, message):
        sio.emit('my_response', {'data': message['data']}, skip_sid=sid)
    # skipsid to ignoreself

    @sio.event()
    def join(sid, message):
        sio.enter_room(sid, message['room'])
        sio.emit('my_response', {'data': 'Entered room: ' + message['room']},
                 room=sid)

    @sio.event()
    def leave(sid, message):
        sio.leave_room(sid, message['room'])
        sio.emit('my_response', {'data': 'Left room: ' + message['room']},
                 room=sid)

    @sio.event()
    def close_room(sid, message):
        sio.emit('my_response',
                 {'data': 'Room ' + message['room'] + ' is closing.'},
                 room=message['room'])
        sio.close_room(message['room'])

    @sio.event()
    def my_room_event(sid, message):
        sio.emit('my_response', {
                 'data': message['data']}, room=message['room'])

    @sio.event()
    def disconnect_request(sid):
        sio.disconnect(sid)

    @sio.event()
    def connect(sid, environ):
        print('\n', sid, 'sid on connexion\n')
        sio.emit('my_response', {
                 'data': 'Connected (server)', 'count': 0}, room=sid)

    @sio.event()
    def disconnect(sid):
        print('\n', sid, 'sid on disconnexion\n')
        sio.disconnect(sid)
        print('Client disconnected')

    return JsonResponse({"cool": "cool"})

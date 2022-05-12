from django.shortcuts import render

async_mode = 'eventlet'

import os

from django.http import HttpResponse, JsonResponse
import socketio

sio = socketio.Server(async_mode=async_mode, cors_allowed_origins='http://localhost:3000') 

'''to print the logs'''
#logger=True, engineio_logger=True, 

def index(request):

    return JsonResponse({"cool":"cool"})


@sio.event() #namespace='/dung' revoir le fonctionnement et mieux comprendre l'intérêt
def my_event(sid, message):

    # event de base adressé à tlm ?
    print('msg', message)
    sio.emit('my_response', data={'data': message['data'], 'sid': sid}, room=sid) # 


@sio.event()
def join(sid, message):

    # join room, on peut dans l'ui aller vers une autre page
    sio.enter_room(sid, message['room'])
    sio.emit('my_response', data = {'data': 'Entered room: ' + message['room'], 'room': message['room']}, room=sid)


@sio.event()
def leave(sid, message):
    sio.leave_room(sid, message['room'])
    sio.emit('my_response', {'data': 'Left room: ' + message['room']}, room=sid)


@sio.event()
def close_room(sid, message):
    sio.emit('my_response',
            {'data': 'Room ' + message['room'] + ' is closing.'},
            room=message['room'])
    sio.close_room(message['room'])


@sio.event()
def my_room_event(sid, message):
    print('message reçu serveur', message)
    sio.emit('my_response', {'data': message['data'], 'user': message['user'],}, room=message['room'])
    print('msg emit à priori\n')


@sio.event()
def disconnect_request(sid):
    sio.disconnect(sid)


@sio.event()
def connect(sid, environ):
    print('\n', sid, 'sid on connexion\n')
    sio.emit('my_response', {'data': 'Connected (server)', 'count': 0}, room=sid )


@sio.event()
def disconnect(sid):
    print('\n', sid, 'sid on disconnexion\n')
    sio.disconnect(sid)
    print('Client disconnected')

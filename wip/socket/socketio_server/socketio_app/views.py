import socketio
from django.http import HttpResponse
import os
from django.shortcuts import render

# Create your views here.

async_mode = 'eventlet'

sio = socketio.Server(async_mode=async_mode,
                      cors_allowed_origins='http://localhost:3000')


def index(request):

    return HttpResponse()


@sio.event()
def connect(sid, message):
    sio.enter_room(sid, 'chat_user')
    print(f'\n>>>>>>>>>  SID: {sid} <<<<<<<<<<<<\n')


@sio.event
def my_message(sid, message):
    print(f'\n>>>>>>>>> Message: {message} <<<<<<<<<<')
    sio.emit('my_response', data=message)  # room=sid

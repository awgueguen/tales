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
def connect(sid, environ, auth):
    print(f'\n>>>>>>>>>  CONNECT: {sid} <<<<<<<<<<<<\n')


@sio.event()
def disconnect(sid):
    print(f'\n>>>>>>>>>  DISCONNECT: {sid} <<<<<<<<<<<<\n')


@sio.event
def my_message(sid, data):
    print(f'\n>>>>>>>>> MESSAGE: {data["room"]} <<<<<<<<<<\n')
    sio.emit('my_response', data=data["message"],
             room=data["room"])


@sio.on("begin_chat")
def start_room(sid, room):
    sio.enter_room(sid, room)
    print(f'\n>>>>>>>>> ENTERED: {room} <<<<<<<<<<\n')


# @sio.on("exit_chat")
# def close_room(sid, room):
#     sio.leave_room(sid, room)
#     print(f'\n>>>>>>>>> LEFT: {room} <<<<<<<<<<\n')

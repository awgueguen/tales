import socketio
from django.http import HttpResponse

async_mode = 'eventlet'

sio = socketio.Server(async_mode=async_mode,
                      cors_allowed_origins='http://localhost:3000')


def index(request):
    return HttpResponse()


@sio.event()
def my_event(sid, message):
    sio.emit('my_response', data={
             'data': message['data'], 'sid': sid}, room=sid)


@sio.event()
def join(sid, message):
    sio.enter_room(sid, message['room'])
    sio.emit('my_response', data={'data': 'Entered room: ' +
             message['room'], 'room': message['room'], 'date': message['date'], 'log': True}, room=sid)


@sio.event()
def leave(sid, message):
    sio.leave_room(sid, message['room'])
    sio.emit('my_response', {
             'data': 'Left room: ' + message['room']}, room=sid)


@sio.event()
def close_room(sid, message):
    sio.emit('my_response',
             {'data': 'Room ' + message['room'] + ' is closing.'},
             room=message['room'])
    sio.close_room(message['room'])


@sio.event()
def my_room_event(sid, message):
    if not (img := message.get('img')):
        img = ''
    sio.emit(
        'my_response',
        {
            'data': message['data'],
            'date': message['date'],
            'user': message['user'],
            'user_id': message['user_id'],
            'is_admin': message['is_admin'],
            'img': img,
            'log': message['log'],
        },
        room=message['room'])


@sio.event()
def disconnect_request(sid):
    sio.disconnect(sid)


@sio.event()
def connect(sid, environ):
    return


@sio.event()
def disconnect(sid):
    sio.disconnect(sid)

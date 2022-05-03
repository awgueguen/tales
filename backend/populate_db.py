from datetime import datetime
import os
 
import random

from faker import Faker
faker = Faker()

os.environ.setdefault('DJANGO_SETTINGS_MODULE','backend.settings')

# from django.core.wsgi import get_wsgi_application
# application = get_wsgi_application()


import django
django.setup()

import blablapp.models as model

POSSIBLE_ACTIONS = ['attack', 'move', 'defend', 'rob', 'run away', 'use']
now = datetime.now()


# def add_actions():

#     for elem in POSSIBLE_ACTIONS:
#         description = faker.paragraph(nb_sentences=3)
#         model.Action.objects.get_or_create(title=elem, description=description, trigger=f'!{elem}')


def add_admin():

    params = {
        'firstName': faker.first_name(),
        'lastName': faker.last_name(),
        'login': 'superuser',
        'password': 'superuserdeouf',
        'mail': 'test@gmail.com',
        'birthdate': faker.date(),
        'nickname': faker.user_name()
    }
    user = model.MyUser.objects.get_or_create(params)
    user[0].save()


def add_user():

    params = {
        'first_name': faker.first_name(),
        'last_name': faker.last_name(),
        'username': faker.user_name(),
        'password': faker.password(length=12),
        'email': faker.ascii_email(),
        'birthdate': faker.date(),
        'nickname': faker.user_name()
    }
    # print(params['first_name'])
    # print(params)
    user, is_user = model.MyUser.objects.get_or_create(params)
    user.save()
    print(f'user_data : {user} created : {is_user}')

    tickbox, is_tickbox = model.Tickbox.objects.get_or_create(userId=user, checked=True)
    tickbox.save()
    return user


def add_contact(user1, user2):

    params = {
        'senderId': user1,
        'recieverId': user2,
        'approved': True,
        'approvedAt': now,
        'refusedAt': now,
    }
    contact, is_contact = model.Contact.objects.get_or_create(params)
    # print(params)
    # print(f'contact_data : {contact} created : {is_contact}')
    contact.save()


def add_room(public=False):

    params = {
        'title': f'{faker.name()} room',
        'deletedAt': now,
        'maxParticipants': 5,
        'isPublic': public,
    }
    room = model.Room.objects.get_or_create(params)
    return room[0]


def add_room_participant(room, user, nick=False, admin=False):

    params = {
        'roomId': room,
        'userId': user,
        'isAdmin': admin,
        'nickname': nick if nick else faker.user_name(),
        'active': True,
    }
    room_participant = model.RoomParticipant.objects.get_or_create(params)[0]
    # print(f'test: {room_participant}')
    room_participant.save()


def add_characters():
    #mettre le user ou vice versa

    params = {
        'name': faker.first_name(),
        'description': faker.paragraph(nb_sentences=3),
        'hp': faker.random_int(min=0, max=15),
        'atk': faker.random_int(min=0, max=15),
        'defense': faker.random_int(min=0, max=15),
        # actions: 

    }

def populate_db(N=40):
    """
    Create 40 Users which all are RoomParticipants, some being admins,
    20 contacts between even and odd Users and 5 Rooms without story
    """

    # try:
    add_admin()
    for i in range(N):
        if i % 2 == 0:
            user1 = add_user()
            user = user1
            if i % 8 == 0:
                if i % 3 == 0:
                    room = add_room(public=True)
                else:
                    room = add_room()
        else:
            user2 = add_user()
            user = user2
            add_contact(user1, user2)
        if i % 8 == 0:
            add_room_participant(room, user, nick='', admin=True)
        else:
            if i % 2:
                add_room_participant(room, user, nick=True, admin=False)
            else:
                add_room_participant(room, user, nick=False, admin=False)
    # except Exception:
    #     print(f'error occured: {Exception}')
    print('population succeed')


if __name__ == '__main__':

    populate_db()
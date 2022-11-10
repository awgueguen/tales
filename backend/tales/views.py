"""WIP"""
from collections import OrderedDict
from django.db.models import Q
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from tales import serializers
from tales import models

import json


# --------------------------------------------------------------------------- #
# REGISTER & TOKEN                                                            #
# --------------------------------------------------------------------------- #

# token --------------------------------------------------------------------- #

class MyTokenObtainPairView(TokenObtainPairView):
    # throttle_classes = [UserRateThrottle, AnonRateThrottle]
    serializer_class = serializers.MyTokenObtainPairSerializer

# register ------------------------------------------------------------------ #


@api_view(['POST'])
def register_user(request):
    serializer = serializers.RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def background_check(request):
    email, username = request.data['email'], request.data['username']
    _email = models.MyUser.objects.filter(email=email)
    _username = models.MyUser.objects.filter(username=username)
    response = {'email': True, 'username': True}
    if len(_email) > 0:
        response['email'] = False
    if len(_username) > 0:
        response['username'] = False
    return Response(data=response, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------- #
# GAMEPLAY                                                                    #
# --------------------------------------------------------------------------- #

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def triggers(request):
    """Get all the available triggers and return them to the user.

    Args:
        request (Request): request with user & room informations.

    Returns:
        Response: response containing all the available triggers.
    """
    # get info -------------------------------------------------------------- #
    room_id = request.GET.get("room_id")
    username = request.user

    # get available triggers ------------------------------------------------ #

    # entities -------------------------------------------------------------- #
    entity_instances = models.EntityInstance.objects.filter(room=room_id)
    entity_instances_serializer = serializers.EntityInstanceTriggers(
        entity_instances, many=True)
    entity_instances_triggers = [dict(item, **{'tab': 'EntityInstance'})
                                 for item in entity_instances_serializer.data]

    # story ----------------------------------------------------------------- #
    story = models.Story.objects.filter(room=room_id)
    story_serializer = serializers.StoryTriggers(story, many=True)
    story_trigger = [dict(item, **{'tab': 'Story'})
                     for item in story_serializer.data]

    story_id = story_trigger[0]['id']

    # event ----------------------------------------------------------------- #
    event = models.Event.objects.filter(stories__id=story_id)
    event_serializer = serializers.EventTriggers(event, many=True)
    event_triggers = [dict(item, **{'tab': 'Event'})
                      for item in event_serializer.data]

    # actions --------------------------------------------------------------- #
    action_triggers = []

    try:
        character = models.Character.objects.get(
            rooms__room=room_id, user__username=username)
        character_serializer = serializers.CharacterSerializer(character).data

        action_triggers = [{'id': i['id'], 'title': i["title"], 'trigger': i['trigger'], 'tab': 'Action'}
                           for i in character_serializer['characterClass']['actions']]

    # except -> in case the user happend to be connected to a room without a character
    except models.Character.DoesNotExist:
        # print('no character associated\nplease connect with someone registered in the room')
        return Response([entity_instances_triggers + story_trigger + event_triggers], status=status.HTTP_200_OK)

    return Response([entity_instances_triggers + story_trigger + event_triggers + action_triggers], status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def submit_trigger(request):
    """Submit a typed trigger and execute the according action.

    Args:
        request (Request): Selected trigger.

    Returns:
        Response: Status of the response 400/200
    """
    # TODO Ajouter une vérification du trigger en fonction du statut avec un retour dans le chat.

    if request.data['tab'] == "Action":
        res = models.Action.objects.get(trigger=request.data['trigger'])
        data = serializers.ActionSerializer(res)

    elif request.data['tab'] == 'Event':
        res = models.Event.objects.get(trigger=request.data['trigger'])
        data = serializers.EventSerializer(res)

    elif request.data['tab'] == 'Story':
        res = models.Event.objects.get(trigger=request.data['trigger'])
        data = serializers.StorySerializer(res)

    elif request.data['tab'] == 'EntityInstance':
        res = models.EntityInstance.objects.get(
            trigger=request.data['trigger'])
        data = serializers.EntityInstanceSerializer(res)

    else:
        res = models.Story.objects.get(trigger=request.data['trigger'])
        data = serializers.StorySerializer(res)

    content = json.dumps(data.data)
    # Retrieve from contentn 'is_admin' & cross check the request.data['tab'] information

    query = {
        'room': request.data['roomId'],
        'sender': request.user.id,
        'messageContent': content,
        'isTriggered': True
    }

    res_query = serializers.TriggerSerializer(data=query)

    if not res_query.is_valid():
        res_query.data
        print('>>>>', res_query.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    res_query.save()

    return Response(status=status.HTTP_200_OK)

# --------------------------------------------------------------------------- #
# CHARACTERS                                                                  #
# --------------------------------------------------------------------------- #


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def characters_api(request):
    user = request.user

    if request.method == 'GET':
        characters = models.Character.objects.filter(user=user)
        res = serializers.CharacterSerializer(characters, many=True)
        return Response(res.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = serializers.CharacterSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------------------------------- #
# LAYOUT                                                                      #
# --------------------------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def quick_access(request):
    # TODO Front part not working as intended.
    rooms = models.Room.objects.filter(
        participants__user__username=request.user)
    rooms = serializers.RoomQuickSerializer(rooms, many=True)

    return Response(data=rooms.data, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------- #
# HOMEPAGE                                                                    #
# --------------------------------------------------------------------------- #

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def homepage_rooms(request):
    user = request.user
    rooms = models.Room.objects.filter(
        Q(participants__user__username=user) | Q(isPublic=True)).distinct()
    rooms = serializers.SerializerRoomsGE(rooms, many=True).data

    return Response(data=rooms, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------- #
# ROOMS                                                                       #
# --------------------------------------------------------------------------- #

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_a_room(request, room_id):
    try:
        room = models.Room.objects.get(id=room_id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    room_serializer = serializers.RoomSerializer(room)
    return Response(room_serializer.data, status=status.HTTP_200_OK)


@ api_view(['POST'])
@ authentication_classes([JWTAuthentication])
@ permission_classes([permissions.IsAuthenticated])
def create_room(request):
    """OK"""

    room = request.data['room']
    # print(room)

    moderator = get_user_detail(request.user)
    res = serializers.RoomSerializer(data=room)
    if not res.is_valid():
        return Response({'err': 'problem creating the room'}, status=status.HTTP_400_BAD_REQUEST)
    res.save()
    response = {'room': res.data}

    mod = serializers.RoomParticipantSerializer(data={
        'room': res.data['id'],
        'user': moderator['id'],
        'isAdmin': True,
        'nickname': moderator['nickname'],
    })
    if not mod.is_valid():
        return Response({'err':  'problem creating the mod'}, status=status.HTTP_400_BAD_REQUEST)

    mod.save()
    response['mod'] = mod.data

    response['players'] = []
    for elem in room['invitations']:
        player = serializers.RoomParticipantSerializer(data={
            'room': res.data['id'],
            'user': elem['id'],
            'nickname': elem['nickname'],
        })
        if not player.is_valid():
            return Response({'err': f"player {elem['username']} couldn't be created"}, status=status.HTTP_400_BAD_REQUEST)

        player.save()
        response['players'] += [player.data]

    # message --------------------------------------------------------------- #
    story = models.Story.objects.get(id=room['story'])
    res_story = serializers.StorySerializer(story).data

    message = json.dumps(res_story)

    query = {
        'room': response['room']['id'],
        'sender': response['mod']['user'],
        'messageContent': message,
        'isTriggered': True,
    }

    print('>>>>', query)

    res_query = serializers.TriggerSerializer(data=query)
    if not res_query.is_valid():
        res_query.data
        print(res_query.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    res_query.save()

    return Response(response, status=status.HTTP_201_CREATED)


# room participants --------------------------------------------------------- #


@ api_view(['GET', 'POST', 'PUT'])
@ authentication_classes([JWTAuthentication])
@ permission_classes([permissions.IsAuthenticated])
def roomparticipants_api(request, room_id=None):
    """OK"""

    if request.method == 'GET':
        try:
            roomparticipants = models.RoomParticipant.objects.filter(
                Q(room=room_id))
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        response = serializers.RoomParticipantCharaSerializer(
            roomparticipants, many=True).data

        return Response(response, status=status.HTTP_200_OK)

    username = request.user
    user = get_user_detail(username)

    if request.method == 'POST':
        if not (nickname := request.data.get('nickname')):
            nickname = request.data['character'].get('nickname')

        roompart = serializers.RoomParticipantSerializer(data={
            'room': int(request.data['room']),
            'user': request.data['user'],
            'nickname': nickname,
            'character': request.data['character'].get('id'),
        })

        if roompart.is_valid():
            roompart.save()
            return Response({'user': user}, status=status.HTTP_201_CREATED)
        return Response({'err':  f"problem creating {user['username']} roomppart"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            room_participant = models.RoomParticipant.objects.get(
                id=request.data['put'])
            serializer = serializers.ParticipantPutSerializer(
                room_participant, data={
                    'nickname': request.data['update']['nickname'],
                    'character': request.data['update']['character'],
                })
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print(serializer.errors)
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# messagerie ---------------------------------------------------------------- #


@ api_view(['GET', 'POST'])
@ authentication_classes([JWTAuthentication])
@ permission_classes([permissions.IsAuthenticated])
def messages_api(request, room_id):

    # TODO: récup isAdmin depuis le sender de chaque message

    # username = request.user
    # user = get_user_detail(username)

    if request.method == 'GET':
        # wanted_values = ['id', 'messageContent', 'image', 'createdAt', 'isTriggered', 'sender', 'room']
        messages = models.Message.objects.filter(
            room=room_id, deleted=False)  # .values(*wanted_values)
        response = serializers.MessageSerializer(messages, many=True).data
        return Response({'messages': response}, status=status.HTTP_200_OK)

    if request.method == 'POST':
        # TODO : ajouter whisper, img, etc..
        messageContent = request.data['messageContent']
        # user_id = request.data['sender']
        # room_id = request.data['room']
        user = models.MyUser.objects.get(id=request.data['sender'])
        room = models.Room.objects.get(id=int(request.data['room']))
        sender = serializers.MyUserSerializer(user).data
        room = serializers.RoomSerializer(room).data
        ser = serializers.PostedMessageSerializer(
            data={'sender': sender['id'], 'room': room['id'], 'messageContent': messageContent})
        if ser.is_valid():
            ser.save()
            return Response({'message': ser.data}, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


#  sender = models.MyUser.objects.get(username=request.user)

#         receiver = serializers.MyUserSerializer(receiver).data['id']
#         sender = serializers.MyUserSerializer(sender).data['id']

#         serializer = serializers.ContactSerializer(data={'sender': sender, 'receiver': receiver, 'approved': True})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------------------------------- #
# USER SETTINGS                                                               #
# --------------------------------------------------------------------------- #

# --------------------------------------------------------------------------- #
# ASSSETS                                                                     #
# --------------------------------------------------------------------------- #

@ api_view(['GET', 'PUT', 'DELETE'])
@ authentication_classes([JWTAuthentication])
@ permission_classes([permissions.IsAuthenticated])
def stories_api(request):
    '''WIP'''
    if request.method == 'GET':
        stories = models.Story.objects.all()
        res = serializers.StoryModalSerializer(stories, many=True)
        return Response(data=res.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return

# --------------------------------------------------------------------------- #
# CONTACTS                                                                    #
# --------------------------------------------------------------------------- #


@ api_view(['GET'])
@ authentication_classes([JWTAuthentication])
@ permission_classes([permissions.IsAuthenticated])
def contacts_api(request):
    """OK"""
    user = request.user
    contact_list = models.Contact.objects.filter(
        Q(sender__username=user) | Q(receiver__username=user), approved=True)
    sender = contact_list.values_list('sender', flat=True)
    receiver = contact_list.values_list('receiver__id', flat=True)
    contact_list = models.MyUser.objects.filter(
        Q(id__in=sender) | Q(id__in=receiver), ~Q(username=user))
    res = serializers.ContactUserSerializer(contact_list, many=True)
    return Response(data=res.data, status=status.HTTP_200_OK)


@ api_view(['GET', 'POST'])
@ authentication_classes([JWTAuthentication])
@ permission_classes([permissions.IsAuthenticated])
def add_contact(request):
    """OK"""
    if request.method == 'GET':
        receiver = request.GET.get("receiver")

        try:
            receiver = models.MyUser.objects.get(username__iexact=receiver)
            return Response(status=status.HTTP_200_OK)
        except models.MyUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        sender = request.user
        receiver = request.data.get("receiver")

        sender = models.MyUser.objects.get(username=sender).id
        receiver = models.MyUser.objects.get(username__iexact=receiver).id

        serializer = serializers.ContactSerializer(
            data={'sender': sender, 'receiver': receiver, 'approved': True})

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------------------------------- #
# functions                                                                   #
# --------------------------------------------------------------------------- #

def get_user_detail(user: any) -> dict:

    # print(user, 'user dans fonction')

    try:
        if type(user) == str:
            user = models.MyUser.objects.get(id=user)
        elif type(user) == int:
            user = models.MyUser.objects.get(username=user)
    except models.MyUser.DoesNotExist:
        return f'error: user {user} not found'
    return serializers.MyUserSerializer(user).data


def get_room_participants_by_user_id(user_id: int) -> 'list[OrderedDict]':
    try:
        rooms_participants_ = models.RoomParticipant.objects.filter(
            user_id=user_id)
    except models.RoomParticipant.DoesNotExist:
        return f'error: (get_by_id) user with id {user_id} not found'
    rooms_participants = serializers.RoomParticipantSerializer(
        rooms_participants_, many=True)
    return rooms_participants.data


def get_room_participant_of_this_room(user_id: int, room_id: int) -> OrderedDict:

    try:
        room_participant_ = models.RoomParticipant.objects.get(
            Q(room__id=room_id) & Q(user__id=user_id))
    except models.RoomParticipant.DoesNotExist:
        return f'error: (get_this_room) user with id {user_id} not found'
    room_participant = serializers.RoomParticipantCharaSerializer(
        room_participant_)
    return room_participant.data


def get_room_participants_by_room_list(room_list: 'list[int]') -> 'list[OrderedDict]':

    try:
        rooms_participants_ = models.RoomParticipant.objects.filter(
            room__in=room_list)
    except models.RoomParticipant.DoesNotExist:
        return 'no participant found'
    rooms_participants = serializers.RoomParticipantSerializer(
        rooms_participants_, many=True)
    return rooms_participants.data


def get_rooms_by_list_id(rooms_ids: 'list[int]') -> 'list[OrderedDict]':
    try:
        rooms_ = models.Room.objects.filter(id__in=rooms_ids)
    except models.Room.DoesNotExist:
        return 'error: no room found'
    rooms = serializers.RoomSerializer(rooms_, many=True)
    return rooms.data


def get_stories_by_list_id(stories_ids: 'list[int]') -> 'list[OrderedDict]':
    try:
        stories_ = models.Story.objects.filter(id__in=stories_ids)
    except models.Story.DoesNotExist:
        return 'error: no story found'
    stories = serializers.StorySerializer(stories_, many=True)
    return stories.data


def get_all_rooms() -> 'list[OrderedDict]':
    try:
        rooms_ = models.Room.objects.all()
    except models.RoomParticipant.DoesNotExist:
        return "there's no room yet"

    rooms = serializers.RoomSerializer(rooms_, many=True)
    # print(rooms.data)
    return rooms.data


def filter_by(look_for: dict, _in: dict, _key: str) -> 'list[dict]':
    for i in range(len(look_for)):
        for j in range(len(_in)):
            if look_for[i]['id'] == _in[j][_key]:
                _in[j][_key] = look_for[i]
    return(_in)


"""WIP"""
from collections import OrderedDict
# from django.http import JsonResponse
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from django.db.models import Q
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from blablapp import serializers
from blablapp import models


# --------------------------------------------------------------------------- #
# REGISTER                                                                    #
# --------------------------------------------------------------------------- #

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.MyTokenObtainPairSerializer

# @api_view(['POST'])
# def register_user(request):
#     serializer = serializers.RegisterSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET', 'POST', 'PUT'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def tick_api(request):

#     if request.method == 'GET':
#         return
#     if request.method == 'POST':
#         return
#     if request.method == 'PUT':
#         return


# --------------------------------------------------------------------------- #
# GAMEPLAY                                                                    #
# --------------------------------------------------------------------------- #

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def trigger(request):

    room_id = request.GET.get("room_id")
    username = request.user

    entity_instances = models.EntityInstance.objects.filter(room=room_id)
    entity_instances_serializer = serializers.EntityInstanceTriggers(
        entity_instances, many=True)
    entity_instances_triggers = [dict(item, **{'tab': 'EntityInstance'})
                                 for item in entity_instances_serializer.data]

    story = models.Story.objects.filter(room=room_id)
    story_serializer = serializers.StoryTriggers(story, many=True)
    story_trigger = [dict(item, **{'tab': 'Story'})
                     for item in story_serializer.data]

    story_id = story_trigger[0]['id']

    event = models.Event.objects.filter(stories__id=story_id)
    event_serializer = serializers.EventTriggers(event, many=True)
    event_triggers = [dict(item, **{'tab': 'Event'})
                      for item in event_serializer.data]

    action_triggers = []

    try:
        character = models.Character.objects.get(
            rooms__room=room_id, user__username=username)
        character_serializer = serializers.CharacterSerializer(character).data

        action_triggers = [{'id': i['id'], 'title': i["title"], 'trigger': i['trigger'], 'tab': 'Action'}
                           for i in character_serializer['characterClass']['actions']]

    except models.Character.DoesNotExist:
        print('no character associated\nplease connect with someone registered in the room')
        return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response([entity_instances_triggers + story_trigger + event_triggers + action_triggers])

# --------------------------------------------------------------------------- #
# CHARACTERS                                                                  #
# --------------------------------------------------------------------------- #

# --------------------------------------------------------------------------- #
# STORY                                                                       #
# --------------------------------------------------------------------------- #

# --------------------------------------------------------------------------- #
# ROOMS                                                                       #
# --------------------------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def quick_access(request):
    '''OK'''
    rooms = models.Room.objects.filter(
        participants__user__username=request.user)
    rooms = serializers.RoomQuickSerializer(rooms, many=True)

    return Response(data=rooms.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_user_rooms_list(request):
    """OK"""
    rooms_participants = get_room_participants_by_user_id(request.user.id)
    roompart_response = [{key: val for key, val in elem.items() if key in [
        'id', 'isAdmin', 'nickname', 'room', 'character']} for elem in rooms_participants]
    rooms_ids = [e['room'] for e in rooms_participants]

    rooms = get_rooms_by_list_id(rooms_ids)
    stories_ids = [e['story'] for e in rooms]
    room_response = [{key: val for key, val in elem.items() if key in
                      ['id', 'maxParticipants', 'isPublic', 'title', 'description', 'story', ]} for elem in rooms]

    stories = get_stories_by_list_id(stories_ids)
    story_response = [{key: val for key, val in elem.items(
    ) if key in ['id', 'title', 'image']} for elem in stories]

    room_response = filter_by(story_response, room_response, 'story')
    roompart_response = filter_by(room_response, roompart_response, 'room')

    return Response(data=roompart_response, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_public_rooms(request):
    ''' OK'''

    rooms = [{key: val for key, val in elem.items() if key in
              ['id', 'maxParticipants', 'isPublic', 'title', 'description', 'story', ]}
             for elem in get_all_rooms() if elem['isPublic']]

    rooms_id = [e['id'] for e in rooms]
    room_participants = get_room_participants_by_room_list(rooms_id)

    stories_ids = [e['story'] for e in rooms]
    stories = get_stories_by_list_id(stories_ids)
    story_response = [{key: val for key, val in elem.items(
    ) if key in ['id', 'title', 'description', 'image']} for elem in stories]

    room_response = filter_by(story_response, rooms, 'story')

    for elem in room_participants:
        for data in room_response:
            if elem['room'] == data['id']:
                try:
                    data['participants'] += [elem]
                except KeyError:
                    data['participants'] = []
                    data['participants'] += [{key: val for key, val in elem.items(
                    ) if key in ['id', 'isAdmin', 'nickname', 'character', 'user']}]

    return Response(data=room_response, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def create_room(request):

    # TODO: PUT (penser à trier le dict request.data['room'] for x in [champs_desirés] ou serializerPut ?)

    room = request.data['room']

    if request.method == 'POST':
        moderator = get_user_detail(request.user)
        res = serializers.RoomSerializer(data=room)
        if res.is_valid():
            res.save()
            response = {'room': res.data}

        else:
            return Response({'err': 'problem creating the room'}, status=status.HTTP_400_BAD_REQUEST)
        mod = serializers.RoomParticipantSerializer(data={
            'room': res.data['id'],
            'user': moderator['id'],
            'isAdmin': True,
            'nickname': moderator['nickname'],
            'character': 1,
        })
        if mod.is_valid():
            mod.save()
            response['mod'] = mod.data

        else:
            return Response({'err':  'problem creating the mod'}, status=status.HTTP_400_BAD_REQUEST)

        response['players'] = []
        for elem in room['invitations']:
            player = serializers.RoomParticipantSerializer(data={
                'room': res.data['id'],
                'user': elem['id'],
                'nickname': elem['nickname'],
                'character': 1,
            })
            if player.is_valid():
                player.save()
                response['players'] += [player.data]
            else:
                return Response({'err': f"player {elem['username']} couldn't be created"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response, status=status.HTTP_201_CREATED)

    if request.method == 'PUT':
        return


# --------------------------------------------------------------------------- #
# USER SETTINGS                                                               #
# --------------------------------------------------------------------------- #


# --------------------------------------------------------------------------- #
# CONTACTS                                                                    #
# --------------------------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def contacts(request):
    """OK"""
    user = request.user
    contact_list = models.Contact.objects.filter(
        Q(sender__username=user) | Q(receiver__username=user), approved=True)
    sender = contact_list.values_list('sender', flat=True)
    receiver = contact_list.values_list('receiver__id', flat=True)

    contact_list = models.MyUser.objects.filter(
        Q(id__in=sender) | Q(id__in=receiver), ~Q(username=user))
    res = serializers.MyUserSerializer(contact_list, many=True)
    return Response(data=res.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
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

# def get_is_admin(user_id, room_id):

#     try:
#         room_part = models.RoomParticipant.objects.get(rooms__id=user_id, participants__id=room_id)
#     except models.MyUser.DoesNotExist:
#         return f'error: user with id {user_id} not found'
#     return serializers.RoomParticipant(room_part).data


def get_room_participants_by_user_id(user_id: int) -> 'list[OrderedDict]':
    try:
        rooms_participants_ = models.RoomParticipant.objects.filter(
            user_id=user_id)
    except models.RoomParticipant.DoesNotExist:
        return f'error: user with id {user_id} not found'
    rooms_participants = serializers.RoomParticipantSerializer(
        rooms_participants_, many=True)
    return rooms_participants.data


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

# --------------------------------------------------------------------------- #
# WIP                                                                         #
# --------------------------------------------------------------------------- #

# @api_view(['GET', 'POST', 'PUT'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def user_contacts_api(request):

#     user_id = get_user_detail(request.user)['id']

#     if request.method == 'GET':
#         try:
#             mycontacts = models.Contact.objects.filter(Q(sender=user_id) | Q(
#                 receiver=user_id)).distinct().filter(approved=True)
#             # filter(approved=True)
#         except mycontacts.DoesNotExit:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         res = serializers.ContactSerializer(mycontacts, many=True).data
#         friends_ids = [elem['receiver'] if elem['sender'] ==
#                        user_id else elem['receiver'] for elem in res]

#         try:
#             friends = models.MyUser.objects.filter(id__in=friends_ids)
#         except mycontacts.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         response = serializers.MyUserSerializer(friends, many=True)

#         return JsonResponse({"user_contact": response.data})


# @api_view(['GET', 'POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def characters_api(request):
#     user = request.user

#     if request.method == 'GET':
#         characters = models.Character.objects.filter(user=user)
#         res = serializers.CharacterSerializer(characters, many=True)
#         return JsonResponse({"characters": res.data})

#     if request.method == 'POST':
#         serializer = serializers.CharacterSerializer(user, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def classes_api(request):

#     classes = models.CharacterClass.objects.all()
#     res = serializers.CharacterClassSerializer(classes, many=True)
#     return JsonResponse({"classes": res.data})


# @api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def actions_api(request):

#     actions = models.Action.objects.all()
#     res = serializers.ActionSerializer(actions, many=True)
#     return JsonResponse({"actions": res.data})

# @api_view(['GET', 'PUT', 'DELETE'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def stories_api(request):


#     if request.method == 'GET':
#         try:
#             stories = models.Story.objects.all()
#         except models.Story.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         res = serializers.StoryModalSerializer(stories, many=True)
#         return JsonResponse({"stories": res.data})
#     if request.method == 'PUT':
#         return
#     if request.method == 'DELETE':
#         return

# @api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def get_room(request, user_id):


#     try:
#         rooms = models.RoomParticipant.objects.get(user=user_id)
#     except models.RoomParticipant.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     res = serializers.MyUserSerializer(rooms)
#     return JsonResponse({"users": res.data})


# @api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def get_user_rooms(request, user_id):

#     try:
#         rooms = models.RoomParticipant.objects.filter(user=user_id)
#     except models.RoomParticipant.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     res = serializers.RoomParticipantSerializer(rooms, many=True)
#     return JsonResponse({"rooms": res.data})

# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def users_api(request, user_id):


#     try:
#         models.MyUser.objects.get(id=user_id)
#     except models.MyUser.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         users = models.MyUser.objects.get(id=user_id)
#         res = serializers.MyUserSerializer(users)
#         return JsonResponse({"users": res.data})


# @api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def messages_api(request, room):

#     if request.method == 'GET':
#         return


# @api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def post_message(request):

#     if request.method == 'POST':
#         return


# @api_view(['PUT', 'DELETE'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def edit_messages(request):

#     if request.method == 'PUT':
#         return
#     if request.method == 'DELETE':
#         return


# @api_view(['GET, PUT, DELETE'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def events_api(request):


#     if request.method == 'GET':
#         return
#     if request.method == 'PUT':
#         return
#     if request.method == 'DELETE':
#         return


# @api_view(['GET, PUT, DELETE'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def entities_api(request):


#     if request.method == 'GET':
#         return
#     if request.method == 'PUT':
#         return
#     if request.method == 'DELETE':
#         return


# @api_view(['POST', 'PUT', 'DELETE'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def create_instances(request):


#     if request.method == 'POST':
#         return
#     if request.method == 'PUT':
#         return
#     if request.method == 'DELETE':
#         return


# @api_view(['GET', 'PUT'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def instances_ingame(request):

#     if request.method == 'GET':
#         return

#     if request.method == 'PUT':
#         return


# @api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def display_assets(request):

#     return


# @api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def create_assets(request):


#     return


# @api_view(['PUT'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def characters_ingame(request):


#     return

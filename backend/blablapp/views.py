from django.http import JsonResponse
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from django.db.models import Q  
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from blablapp import serializers
from blablapp import models

from collections import OrderedDict

# --------------------------------------------------------------------------- #
# token claim customizations                                                  #
# --------------------------------------------------------------------------- #


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.MyTokenObtainPairSerializer


# --------------------------------------------------------------------------- #
# user register                                                               #
# --------------------------------------------------------------------------- #
@api_view(['POST'])
def register_user(request):
    serializer = serializers.RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------------------------------- #
# read-only                                                                   #
# --------------------------------------------------------------------------- #

# character classes --------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def classes_api(request):

    classes = models.CharacterClass.objects.all()
    res = serializers.CharacterClassSerializer(classes, many=True)
    return JsonResponse({"classes": res.data})


# actions ------------------------------------------------------------------- #

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def actions_api(request):

    actions = models.Action.objects.all()
    res = serializers.ActionSerializer(actions, many=True)
    return JsonResponse({"actions": res.data})

# --------------------------------------------------------------------------- #
# triggers                                                                    #
# --------------------------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def trigger(request):
    # TODO ------------------------------------------------------------------ #
    # // get all triggers with this view
    # // Filter actions to only show whats character has
    # // add filter for room id
    # Get everything from one serializer
    # Filter is Admin

    # code ------------------------------------------------------------------ #
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

# characters ---------------------------------------------------------------- #


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def characters_api(request):
    user = request.user

    if request.method == 'GET':
        characters = models.Character.objects.filter(user=user)
        res = serializers.CharacterSerializer(characters, many=True)
        return JsonResponse({"characters": res.data})

    if request.method == 'POST':
        serializer = serializers.CharacterSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def characters_ingame(request):

    # TODO: all

    return


# --------------------------------------------------------------------------- #
# STORY RELATED                                                               #
# --------------------------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def display_assets(request):

    # TODO: all

    return


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def create_assets(request):

    # TODO: all

    return


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def stories_api(request):

    # TODO: PUT POST

    if request.method == 'GET':
        try:
            stories = models.Story.objects.all()
        except models.Story.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        res = serializers.StoryModalSerializer(stories, many=True)
        return JsonResponse({"stories": res.data})
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET, PUT, DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def events_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET, PUT, DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def entities_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['POST', 'PUT', 'DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def create_instances(request):

    # TODO: add new permissions values checking if player is DM of the room
    # TODO: all

    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def instances_ingame(request):

    # TODO: only accept trigger
    # TODO: all

    if request.method == 'GET':
        return

    if request.method == 'PUT':
        return


# --------------------------------------------------------------------------- #
# ROOMS SETTINGS                                                              #
# --------------------------------------------------------------------------- #


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_room(request, user_id):

    # TODO: 

    try:
        rooms = models.RoomParticipant.objects.get(user=user_id)
    except models.RoomParticipant.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    res = serializers.MyUserSerializer(rooms)
    return JsonResponse({"users": res.data})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_user_rooms(request, user_id):

    # TODO: all + check if user is participant, or if room is public
    try:
         rooms = models.RoomParticipant.objects.filter(user=user_id)
    except models.RoomParticipant.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    res = serializers.RoomParticipantSerializer(rooms, many=True)
    return JsonResponse({"rooms": res.data})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_user_rooms_list(request, user_id):

    # TODO:
    user = get_user_detail(user_id)

    rooms_participants = get_room_participants_by_user_id(user_id)
    roompart_response = [{key: val for key,val in elem.items() if key in ['id', 'isAdmin', 'nickname', 'room', 'character']} for elem in rooms_participants]
    rooms_ids = [e['room'] for e in rooms_participants]

    rooms = get_rooms_by_list_id(rooms_ids)
    stories_ids = [e['story'] for e in rooms]
    room_response = [{key: val for key,val in elem.items() if key in ['id', 'maxParticipants', 'isPublic', 'story']} for elem in rooms]
    
    stories = get_stories_by_list_id(stories_ids)
    story_response = [{key: val for key,val in elem.items() if key in ['id', 'title', 'description', 'image']} for elem in stories]

    room_response = filter_by(story_response, room_response, 'story')
    roompart_response = filter_by(room_response, roompart_response, 'room')

    return Response(data=roompart_response, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_public_rooms(request):

    # TODO: 

    rooms = [{key: val for key, val in elem.items() if key in ['id', 'maxParticipants', 'story']} for elem in get_all_rooms() if elem['isPublic']]

    rooms_id = [e['id'] for e in rooms]
    room_participants = get_room_participants_by_room_list(rooms_id)

    stories_ids = [e['story'] for e in rooms]
    stories = get_stories_by_list_id(stories_ids)
    story_response = [{key: val for key,val in elem.items() if key in ['id', 'title', 'description', 'image']} for elem in stories]

    room_response = filter_by(story_response, rooms, 'story')
    '''
    Si on n'a pas besoin de toutes ces extra infos on peut juste mettre 
    nb_participant = len(ce_participant) pour avoir nb_part/max_part
    '''
    for elem in room_participants:
        for i in range(len(room_response)):
            if elem['room'] == room_response[i]['id']:
                try:
                    room_response[i]['participants'] += [elem]
                except:
                    room_response[i]['participants'] = []
                    room_response[i]['participants'] += [{key: val for key,val in elem.items() if key in ['id', 'isAdmin', 'nickname', 'character', 'user']}]

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
            return Response({'err': f'problem creating the room'}, status=status.HTTP_400_BAD_REQUEST)
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
            return Response({'err':  f'problem creating the mod'}, status=status.HTTP_400_BAD_REQUEST)

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


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def messages_api(request, room):

    # TODO: all

    if request.method == 'GET':
        return


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def post_message(request):

    # TODO: all + check if user is member of a room

    if request.method == 'POST':
        return
    # TODO: Whisper & Quote views ?


@api_view(['PUT', 'DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def edit_messages(request):

    # TODO: all + check if user is member of a room

    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


# --------------------------------------------------------------------------- #
# USER SETTINGS                                                               #
# --------------------------------------------------------------------------- #


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def users_api(request, user_id):

    # TODO : add other methods, more specific views / needs
    print(request.user, 'request')
    try:
        models.MyUser.objects.get(id=user_id)
    except models.MyUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        users = models.MyUser.objects.get(id=user_id)
        res = serializers.MyUserSerializer(users)
        return JsonResponse({"users": res.data})

# --------------------------------------------------------------------------- #
# FROM RELATED                                                                #
# --------------------------------------------------------------------------- #

# contact request ----------------------------------------------------------- #


@api_view(['GET', 'POST', 'PUT'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
def contacts_api(request, user_id):

    # TODO: all
# "view de check si l'utilisateur exist
# view pour ajouter le contact à la db"

    if request.method == 'GET':

        #  modifier receiver
        contacts_id = models.Contact.objects.filter(receiver=user_id)
        res = serializers.ContactSerializer(contacts_id, many=True)

        # print('res', res.data)
        res = [elem['sender'] for elem in res.data if elem['approved']] # ?
        users = models.MyUser.objects.filter(id__in=res)

        resbis = serializers.MyUserSerializer(users, many=True) 
        # print('test', resbis.data)
        return JsonResponse({"contacts": resbis.data})
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return



@api_view(['GET', 'POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
# def user_contacts_api(request, user_id):
def user_contacts_api(request):

    # TODO: all
    user_id = get_user_detail(request.user)['id']
    
    if request.method == 'GET':
        try:
            contacts = models.Contact.objects.filter(Q(sender=user_id) | Q(receiver=user_id)).distinct().filter(approved=True)
            # filter(approved=True)
        except models.Contact.DoesNotExit:
            return Response(status=status.HTTP_404_NOT_FOUND)

        res = serializers.ContactSerializer(contacts, many=True).data
        friends_ids = [elem['receiver'] if elem['sender'] == user_id else elem['receiver'] for elem in res]
        
        try:
            friends = models.MyUser.objects.filter(id__in=friends_ids)
        except models.User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        response = serializers.MyUserSerializer(friends, many=True)

        return JsonResponse({"user_contact": response.data})

    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return


# tickbox ------------------------------------------------------------------- #

@api_view(['GET', 'POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def tick_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return



@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def add_user_api(request, username):

    print('test >>>>', request.user)
    try:
        receiver = models.MyUser.objects.get(username__iexact=username)
    except models.MyUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':

        res = serializers.MyUserSerializer(receiver)
        return JsonResponse({"user": res.data})

    if request.method == 'POST':
        sender = models.MyUser.objects.get(username=request.user)

        receiver = serializers.MyUserSerializer(receiver).data['id']
        sender = serializers.MyUserSerializer(sender).data['id']
      
        serializer = serializers.ContactSerializer(data={'sender': sender, 'receiver': receiver, 'approved': True})   
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_user_detail(user: any) -> dict:

    print(user, 'user dans fonction')
    
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


def get_room_participants_by_user_id(user_id:int) -> 'list[OrderedDict]':
    try:
        rooms_participants_ = models.RoomParticipant.objects.filter(user_id=user_id)
    except models.RoomParticipant.DoesNotExist:
        return f'error: user with id {user_id} not found'
    rooms_participants = serializers.RoomParticipantSerializer(rooms_participants_, many=True)
    return rooms_participants.data

def get_room_participants_by_room_list(room_list:'list[int]') -> 'list[OrderedDict]':

    try:
        rooms_participants_ = models.RoomParticipant.objects.filter(room__in=room_list)
    except models.RoomParticipant.DoesNotExist:
        return f'no participant found'
    rooms_participants = serializers.RoomParticipantSerializer(rooms_participants_, many=True)
    return rooms_participants.data


def get_rooms_by_list_id(rooms_ids:'list[int]') -> 'list[OrderedDict]':
    try:
        rooms_ = models.Room.objects.filter(id__in=rooms_ids)
    except models.Room.DoesNotExist:
        return f'error: no room found'
    rooms = serializers.RoomSerializer(rooms_, many=True)
    return rooms.data


def get_stories_by_list_id(stories_ids:'list[int]') -> 'list[OrderedDict]':
    try:
        stories_ = models.Story.objects.filter(id__in=stories_ids)
    except models.Story.DoesNotExist:
            return f'error: no story found'
    stories = serializers.StorySerializer(stories_, many=True)
    return stories.data


def get_all_rooms() -> 'list[OrderedDict]':
    try:
        rooms_ = models.Room.objects.all()
    except models.RoomParticipant.DoesNotExist:
        return f"there's no room yet"

    rooms = serializers.RoomSerializer(rooms_, many=True)
    # print(rooms.data)
    return rooms.data

def filter_by(look_for: dict, _in: dict, _key: str) -> 'list[dict]':

    for i in range(len(look_for)):
        for j in range(len(_in)):
            if look_for[i]['id'] == _in[j][_key]:
                _in[j][_key] = look_for[i]
    return(_in)

from django.http import JsonResponse
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

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

# add in JsonResponse safe = False if the first item is not a proper JSON


# actions ------------------------------------------------------------------- #

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def actions_api(request):

    actions = models.Action.objects.all()
    res = serializers.ActionSerializer(actions, many=True)
    return JsonResponse({"actions": res.data})  # safe=False

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
def trigger(request):

    # TODO: check Django Signals
    return


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

        res = serializers.StorySerializer(stories, many=True)
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





#FEU


@api_view(['POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def create_room(request): #slug ?

    # TODO: PUT
    print(request.__dict__, 'req')
    room = request.data['room']
    moderator = request.user
    # il faudra ajouter isAdmin=True en créant les roomParts
    # _______________________
    # story = request.data.room['story']
    # roomparticipant = request.data['invitation']
    # story = room['story']
    # try:
    #     story_id = models.Story.objects.get(title=story)
    # except models.Story.DoesNotExist:
    #     print('no story found')
    #     return Response(status=status.HTTP_404_NOT_FOUND)
        
    # res = serializers.StorySerializer(story_id)
    # room['story'] = res.data['id']
    # _______________________

    if request.method == 'POST':
        res = serializers.RoomSerializer(data=room)
        if res.is_valid():
            res.save()
            # response = res.data
            return Response(res.data, status=status.HTTP_201_CREATED)
        print('serializer not valid')
        return Response(res.errors, status=status.HTTP_400_BAD_REQUEST)

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

    if request.method == 'GET':
        return JsonResponse({"users": 
        {"last_login": "null", 
        "username": "SergioLoLo", 
        "first_name": "Sergio", 
        "last_name": "Lopez", 
        "email": "chiendelacasse@gmail.com", 
        "nickname": "BougDétère", 
        "unique_id": "BougDétère94-302", 
        "profile_pic": "/media/profile_pics/default.jpg"}
        })
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return



@api_view(['GET', 'POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def user_contacts_api(request, user_id):

    # TODO: all

    if request.method == 'GET':
        try:
            contacts_id = models.Contact.objects.filter(sender=user_id)
        except models.Contact.DoesNotExit:
            return Response(status=status.HTTP_404_NOT_FOUND)
        res = serializers.ContactSerializer(contacts_id, many=True)
        res = [elem for elem in res.data if elem['approved']] 
        return JsonResponse({"user_contact": res})

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



def get_user_detail(user_id: int) -> dict:

    try:
        user = models.MyUser.objects.get(id=user_id)
    except models.MyUser.DoesNotExist:
        return f'error: user with id {user_id} not found'
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

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_user_rooms_list(request, user_id):

    # TODO:
    user = get_user_detail(user_id)
    print('test', user)

    rooms_participants = get_room_participants_by_user_id(user_id)
    roompart_response = [{key: val for key,val in elem.items() if key in ['id', 'isAdmin', 'nickname', 'room', 'character']} for elem in rooms_participants]
    # recup que certaines clefs -> Serializers (fields)
    rooms_ids = [e['room'] for e in rooms_participants]

    # ici il faudra chercher le nb de participants pour une room ?

    rooms = get_rooms_by_list_id(rooms_ids)
    stories_ids = [e['story'] for e in rooms]
    room_response = [{key: val for key,val in elem.items() if key in ['id', 'maxParticipants', 'isPublic', 'story']} for elem in rooms]
    
    stories = get_stories_by_list_id(stories_ids)
    story_response = [{key: val for key,val in elem.items() if key in ['id', 'title', 'description', 'image']} for elem in stories]
    print(f'story_response {story_response}\n\n')

    room_response = filter_by(story_response, room_response, 'story')
    roompart_response = filter_by(room_response, roompart_response, 'room')

    return Response(data=roompart_response, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_public_rooms(request):

    # TODO: chercher tout les rooms participants associés aux rooms pour faire nb/max

    

    rooms = [{key: val for key, val in elem.items() if key in ['id', 'maxParticipants', 'story']} for elem in get_all_rooms() if elem['isPublic']]
    print('rooms in get public rooms', rooms)

    rooms_id = [e['id'] for e in rooms]
    test = get_room_participants_by_room_list(rooms_id)
    print(f'\ntest all participant {len(test)}\n\n')


    stories_ids = [e['story'] for e in rooms]
    stories = get_stories_by_list_id(stories_ids)
    story_response = [{key: val for key,val in elem.items() if key in ['id', 'title', 'description', 'image']} for elem in stories]

    room_response = filter_by(story_response, rooms, 'story')


    print(f'\nfinalcountdown {room_response}\n')


    '''
    Si on n'a pas besoin de toutes ces extra infos on peut juste mettre 
    nb_participant = len(ce_participant) pour avoir nb_part/max_part
    '''
    for elem in test:
        for i in range(len(room_response)):
            if elem['room'] == room_response[i]['id']:
                try:
                    room_response[i]['participants'] += [elem]
                except:
                    room_response[i]['participants'] = []
                    room_response[i]['participants'] += [{key: val for key,val in elem.items() if key in ['id', 'isAdmin', 'nickname', 'character', 'user']}]
        # print(f'\n{elem}\n')

    print(f'\ntest all participant {len(test)}\n\n')
    return Response(data=room_response, status=status.HTTP_200_OK)

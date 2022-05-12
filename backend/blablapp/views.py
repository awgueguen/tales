from django.http import JsonResponse
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from blablapp import serializers
from blablapp import models

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


@api_view(['GET, PUT, DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def stories_api(request):

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


@api_view(['POST, PUT, DELETE'])
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
def get_room(request):

    # TODO: all + check if user is participant, or if room is public

    return


@api_view(['POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def create_room(request, slug):

    # TODO: all

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
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def contacts_api(request):

    # TODO: all

    if request.method == 'GET':
        return
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

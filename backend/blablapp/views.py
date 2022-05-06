from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from blablapp import models
from blablapp import serializers


# --------------------------------------------------------------------------- #
# read-only                                                                   #
# --------------------------------------------------------------------------- #


# character classes --------------------------------------------------------- #


@api_view(['GET'])
def classes_api(request):

    classes = models.CharacterClass.objects.all()
    res = serializers.CharacterClassSerializer(classes, many=True)
    return JsonResponse({"classes": res.data}, safe=False)


# actions ------------------------------------------------------------------- #

@api_view(['GET'])
def actions_api(request):

    actions = models.Action.objects.all()
    res = serializers.ActionSerializer(actions, many=True)
    return JsonResponse({"actions": res.data}, safe=False)

# --------------------------------------------------------------------------- #
# CHARACTERS                                                                  #
# --------------------------------------------------------------------------- #

# characters ---------------------------------------------------------------- #


@api_view(['GET', 'POST'])
def characters_api(request, user_id):

    try:
        user = models.MyUser.objects.get(id=user_id)
    except models.MyUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        characters = models.Character.objects.filter(user=user_id)
        res = serializers.CharacterSerializer(characters, many=True)
        return JsonResponse({"characters": res.data}, safe=False)

    if request.method == 'POST':
        serializer = serializers.CharacterSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def characters_ingame(request):

    # TODO: all

    return


# --------------------------------------------------------------------------- #
# STORY RELATED                                                               #
# --------------------------------------------------------------------------- #

@api_view(['GET'])
def trigger(request):
    return


@api_view(['GET, POST, PUT, DELETE'])
def stories_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET, POST, PUT, DELETE'])
def events_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET, POST, PUT, DELETE'])
def entities_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['POST, PUT, DELETE'])
def instances_api(request):

    # TODO: all

    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET', 'PUT'])
def instances_ingame(request):
    # TODO: all

    if request.method == 'GET':
        return

    if request.method == 'PUT':
        return


# --------------------------------------------------------------------------- #
# ROOMS SETTINGS                                                              #
# --------------------------------------------------------------------------- #

@api_view(['GET'])
def get_room(request):
    return


@api_view(['POST', 'PUT'])
def create_room(request, slug):
    return


@api_view(['GET, POST', 'PUT', 'DELETE'])
def messages_api(request, room):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return

# TODO: Whisper & Quote views ?

# --------------------------------------------------------------------------- #
# USER SETTINGS                                                               #
# --------------------------------------------------------------------------- #


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def users_api(request, user_id):

    # TODO : add other methods, more specific views / needs
    if request.method == 'GET':
        users = models.MyUser.objects.all()
        res = serializers.MyUserSerializer(users, many=True)
        return JsonResponse({"users": res.data}, safe=False)

# --------------------------------------------------------------------------- #
# FROM RELATED                                                                #
# --------------------------------------------------------------------------- #

# contact request ----------------------------------------------------------- #


@api_view(['GET', 'POST', 'PUT'])
def contacts_api(request, user_id):
    # TODO: all

    if request.method == 'GET':
        contacts = models.MyUser.objects.all()
        res = serializers.MyUserSerializer(contacts, many=True)
        
        return JsonResponse({"contacts": res.data}, safe=False)
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return


# tickbox ------------------------------------------------------------------- #

@api_view(['GET', 'POST', 'PUT'])
def tick_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return

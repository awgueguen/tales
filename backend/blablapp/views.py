from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from blablapp import serializers
from blablapp import models

# --------------------------------------------------------------------------- #
# read-only                                                                   #
# --------------------------------------------------------------------------- #

# tests --------------------------------------------------------------------- #
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet


class ClassesViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.CharacterClassSerializer
    queryset = models.CharacterClass.objects.all()
    permission_classes = [IsAuthenticated]

    @action(detail=False)
    def get_list(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


# character classes --------------------------------------------------------- #


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def classes_api(request):
    # print('test')
    classes = models.CharacterClass.objects.all()
    res = serializers.CharacterClassSerializer(classes, many=True)
    return JsonResponse({"classes": res.data})

# add in JsonResponse safe=False if the first item is not a proper JSON


# actions ------------------------------------------------------------------- #

@api_view(['GET'])
def actions_api(request):

    actions = models.Action.objects.all()
    res = serializers.ActionSerializer(actions, many=True)
    return JsonResponse({"actions": res.data})

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
        return JsonResponse({"characters": res.data})

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


@api_view(['GET'])
def display_assets(request):
    return


@api_view(['POST'])
def create_assets(request):
    return


@api_view(['GET, PUT, DELETE'])
def stories_api(request):

    # TODO: all

    if request.method == 'GET':
        return

    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET, PUT, DELETE'])
def events_api(request):

    # TODO: all

    if request.method == 'GET':
        return

    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['GET, PUT, DELETE'])
def entities_api(request):

    # TODO: all

    if request.method == 'GET':
        return

    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


@api_view(['POST, PUT, DELETE'])
def mj_instances(request):

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


@api_view(['GET'])
def messages_api(request, room):

    # TODO: all

    if request.method == 'GET':
        return


@api_view(['POST'])
def post_message(request):
    if request.method == 'POST':
        return
    # TODO: Whisper & Quote views ?


@api_view(['PUT', 'DELETE'])
def edit_messages(request):
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return


# --------------------------------------------------------------------------- #
# USER SETTINGS                                                               #
# --------------------------------------------------------------------------- #


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
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
def tick_api(request):

    # TODO: all

    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return

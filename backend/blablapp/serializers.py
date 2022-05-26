from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from blablapp import models

# --------------------------------------------------------------------------- #
# WIP SERIALIZER                                                              #
# --------------------------------------------------------------------------- #


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Action
        fields = '__all__'


class CharacterClassSerializer(serializers.ModelSerializer):
    actions = ActionSerializer(many=True, read_only=True)

    class Meta:
        model = models.CharacterClass
        fields = '__all__'


class CharacterSerializer(serializers.ModelSerializer):
    characterClass = CharacterClassSerializer()

    class Meta:
        model = models.Character
        fields = '__all__'


class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MyUser
        fields = ['last_login', 'username', 'first_name', 'last_name',
                  'email', 'nickname',  'profile_pic', 'id']


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = '__all__'


class EntityInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EntityInstance
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = '__all__'


class StoryModalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Story
        fields = ['id', 'image', 'title', 'optimalPlayers', 'description']


class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Room
        fields = '__all__'


class RoomParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RoomParticipant
        fields = '__all__'


class CharacterClassShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CharacterClass
        fields = ['id', 'name', 'atk', 'defense', 'hp']


class CharacterShortSerializer(serializers.ModelSerializer):
    characterClass = CharacterClassShortSerializer()

    class Meta:
        model = models.Character
        fields = ['id', 'name', 'background', 'image', 'characterClass']


class RoomParticipantCharaSerializer(serializers.ModelSerializer):
    # ici on utilise un résumé de character mais en utilisant le vrai charactère on pourra
    # facilement avoir toutes les infos class, actions etc pour le mvp++
    character = CharacterShortSerializer()

    class Meta:
        model = models.RoomParticipant
        fields = ['id', 'user', 'character', 'isAdmin', 'nickname', 'hit']

    # def save(self, **kwargs):

    #     return super().save(*kwargs)


class MessageSerializer(serializers.ModelSerializer):
    sender = MyUserSerializer()
    # room = RoomSerializer()

    class Meta:
        model = models.Message
        fields = '__all__'


class PostedMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Message
        fields = '__all__'


class WhisperSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Whisper
        fields = '__all__'


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Quote
        fields = '__all__'


# Serialization allows complex data (querysets, model) to be converted into native Python data.
# These can be easily converted JSON.

# --------------------------------------------------------------------------- #
# rooms                                                                       #
# --------------------------------------------------------------------------- #

class StoryQuickSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Story
        fields = ['id', 'image']


class RoomQuickSerializer(serializers.ModelSerializer):
    story = StoryQuickSerializer()

    class Meta:
        model = models.Room
        fields = ['id', 'title', "story"]


# --------------------------------------------------------------------------- #
# token customizations                                                        #
# --------------------------------------------------------------------------- #

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['profile_pic'] = f"/media/{str(user.profile_pic)}"
        token['nickname'] = user.nickname
        return token

# --------------------------------------------------------------------------- #
# register setup                                                              #
# --------------------------------------------------------------------------- #


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MyUser
        fields = ['first_name', 'last_name', 'email',
                  'nickname', 'birthdate', 'username', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        myUser = models.MyUser(**validated_data)
        myUser.set_password(password)
        myUser.save()
        return myUser


class TickboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tickbox
        fields = '__all__'

# --------------------------------------------------------------------------- #
# contacts serializers                                                        #
# --------------------------------------------------------------------------- #


class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Contact
        fields = ['sender', 'receiver', 'approved']


class ContactUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.MyUser
        fields = ['username', 'nickname', 'id', 'profile_pic']


# --------------------------------------------------------------------------- #
# assets                                                                      #
# --------------------------------------------------------------------------- #


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Story
        fields = ['id', 'title', 'user', 'description',
                  'image', 'optimalPlayers', 'isPublic', 'trigger']


# --------------------------------------------------------------------------- #
# triggers                                                                    #
# --------------------------------------------------------------------------- #


class EntityInstanceTriggers(serializers.ModelSerializer):

    class Meta:
        model = models.EntityInstance
        fields = ['instance', 'name', 'trigger']


class StoryTriggers(serializers.ModelSerializer):

    class Meta:
        model = models.Story
        fields = ['id', 'title', 'trigger']


class ActionTriggers(serializers.ModelSerializer):
    class Meta:
        model = models.Action
        fields = ['id', 'title', 'trigger']


class EventTriggers(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ['id', 'title', 'trigger']

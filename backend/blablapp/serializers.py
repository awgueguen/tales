from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from blablapp import models


# Serialization allows complex data (querysets, model) to be converted into native Python data.
# These can be easily converted JSON.

# --------------------------------------------------------------------------- #
# token customizations                                                        #
# --------------------------------------------------------------------------- #

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
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


# --------------------------------------------------------------------------- #
# basic serializers                                                           #
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
        fields = ['id', 'last_login', 'username', 'first_name', 'last_name',
                  'email', 'nickname', 'unique_id', 'profile_pic', ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Contact
        fields = ['receiver', 'sender', 'approved']



class TickboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tickbox
        fields = '__all__'


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


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Story
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Room
        fields = '__all__'


class RoomParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RoomParticipant
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
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

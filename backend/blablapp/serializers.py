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


class CharacterClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CharacterClass
        fields = '__all__'


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Character
        fields = '__all__'


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Action
        fields = '__all__'


class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MyUser
        fields = ['last_login', 'username', 'first_name', 'last_name',
                  'email', 'nickname', 'unique_id', 'profile_pic', ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Contact
        fields = '__all__'
        """ à modifier : mettre champs spécifiques  """

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

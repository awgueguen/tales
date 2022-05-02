from email.mime import image
from django.db import models
import random


# --------------------------------------------------------------------------- #
# CHARACTERS INFORMATIONS                                                     #
# --------------------------------------------------------------------------- #

class CharacterClass(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=300, blank=True)
    hp = models.IntegerField()
    atk = models.IntegerField()
    defense = models.IntegerField()


class Character(models.Model):
    name = models.CharField(max_length=100)
    background = models.TextField(blank=True)
    image = models.ImageField(upload_to="uploads/characters", blank=True)
    characterClassId = models.ForeignKey(
        CharacterClass, null=True, on_delete=models.SET_NULL)


# --------------------------------------------------------------------------- #
# ACTIONS INFORMATIONS                                                        #
# --------------------------------------------------------------------------- #

class Action(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    trigger = models.CharField(max_length=10, unique=True)


# --------------------------------------------------------------------------- #
# USERS INFORMATIONS                                                          #
# --------------------------------------------------------------------------- #

class User(models.Model):
    # TODO: ABSTRACT USER
    # TODO: PROXY + SLUG
    def id_by_default(self):
        number = ''.join([str(random.randint(0, 9)) for i in range(3)])
        return '{}#{}'.format(self.login, number)

    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100, blank=True)
    login = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    mail = models.EmailField(max_length=100)
    defaultId = models.IntegerField(unique=True, default=id_by_default)
    birthdate = models.DateField(blank=True)
    nickname = models.EmailField(max_length=100)
    profilePic = models.ImageField(
        default='uploads/profile_pics/default.jpg',
        upload_to='uploads/profile_pics')
    # lastLogin = models.DateField(blank=True)
    # isActive = models.BooleanField()
    createdAt = models.DateTimeField(auto_now_add=True)
    editedAt = models.DateTimeField(auto_now=True)


class Contact(models.Model):
    senderId = models.ForeignKey(
        User, related_name="ContactSender", on_delete=models.CASCADE)
    recieverId = models.ForeignKey(
        User, related_name="ContactReceiver", on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)
    sentAt = models.DateTimeField(auto_now_add=True)
    approvedAt = models.DateTimeField(blank=True)
    refusedAt = models.DateTimeField(blank=True)


class Tickbox(models.Model):
    createdAt = models.DateTimeField(auto_now_add=True)
    editAt = models.DateTimeField(auto_now=True, blank=True)
    checked = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# --------------------------------------------------------------------------- #
# STORY & ENTITY                                                              #
# --------------------------------------------------------------------------- #


class Entity(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="uploads/entities", blank=True)
    hp = models.IntegerField()
    atk = models.IntegerField()
    defense = models.IntegerField()
    trigger = models.CharField(max_length=10, unique=True)


# class EntityInstance(models.Model):
#     # TODO: EXTENDS ENTITY + __init__
#     entityId = models.ForeignKey(Entity, on_delete=models.CASCADE)
#     roomId = models.ForeignKey('leads.Room', on_delete=models.CASCADE)
#     hp = models.IntegerField()
#     atk = models.IntegerField()
#     defense = models.IntegerField()

#     def save(self, *args, **kwargs):
#         self.hp = self.entityId.hp
#         self.atk = self.entityId.atk
#         self.defense = self.entityId.defense
#         super(EntityInstance, self).save(*args, **kwargs)

class EntityInstance(Entity):
    currentHP = models.IntegerField(blank=True)
    currentATK = models.IntegerField(blank=True)
    currentDEF = models.IntegerField(blank=True)

    def __init__(self, *args, **kwargs):
        super(EntityInstance, self).__init__(*args, **kwargs)
        if self.currentHP is None:
            self.currentHP = kwargs.get('hp')
        if self.currentATK is None:
            self.currentATK = kwargs.get('atk')
        if self.currentDEF is None:
            self.currentDEF = kwargs.get('defense')


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300, blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to="uploads/events", blank=True)
    chronology = models.IntegerField()
    trigger = models.CharField(max_length=10, unique=True)


class Story(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300, blank=True)
    image = models.ImageField(upload_to="uploads/stories", blank=True)
    optimalPlayers = models.IntegerField(blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    editedAt = models.DateTimeField(auto_now=True, blank=True)
    deletedAt = models.DateTimeField(blank=True)
    deleted = models.BooleanField(default=False)
    trigger = models.CharField(max_length=10, unique=True)
    triggerCount = models.IntegerField(blank=True)
    events = models.ManyToManyField(Event)
    entities = models.ManyToManyField(Entity)


# --------------------------------------------------------------------------- #
# ROOM DETAILS                                                                #
# --------------------------------------------------------------------------- #


# room ---------------------------------------------------------------------- #

class Room(models.Model):
    storyId = models.ForeignKey(Story, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=30)
    createdAt = models.DateTimeField(auto_now_add=True)
    editedAt = models.DateTimeField(auto_now=True, blank=True)
    deletedAt = models.DateTimeField(blank=True)
    maxParticipants = models.IntegerField(blank=True)
    isPublic = models.BooleanField(default=False)


class RoomParticipant(models.Model):
    roomId = models.ForeignKey(Room, on_delete=models.CASCADE)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    isAdmin = models.BooleanField(default=False)
    nickname = models.TextField(max_length=30, blank=True)
    hit = models.IntegerField(default=0)
    joinedAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True, blank=True)
    leftAt = models.DateTimeField(blank=True)
    kicked = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.nickname is None:
            self.nickname = self.userId.nickname
            super(RoomParticipant, self).save(*args, **kwargs)


# messages ------------------------------------------------------------------ #

class Message(models.Model):
    roomId = models.ForeignKey(Room, on_delete=models.CASCADE)
    senderId = models.ForeignKey(User, on_delete=models.CASCADE)
    messageContent = models.TextField(max_length=500)
    # TODO: ImageField pour backend
    image = models.ImageField(upload_to='uploads/messages', blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    editedAt = models.DateTimeField(auto_now=True, blank=True)
    deletedAt = models.DateTimeField(blank=True)
    quoted = models.BooleanField(default=False)
    whispered = models.BooleanField(default=False)
    edited = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)


# message mechanism --------------------------------------------------------- #

class Whisper(models.Model):
    messageId = models.OneToOneField(Message, on_delete=models.CASCADE)
    senderId = models.ForeignKey(
        User, related_name="WhisperSender", on_delete=models.CASCADE)
    receiverId = models.ForeignKey(
        User,  related_name="WhisperReceiver", on_delete=models.CASCADE)


class Quote(models.Model):
    messageId = models.OneToOneField(
        Message, related_name="QuoteSender", on_delete=models.CASCADE)
    quotedId = models.ForeignKey(
        Message, related_name="QuoteReceiver", null=True,
        on_delete=models.SET_NULL)

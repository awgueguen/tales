from django.db import models
from django.contrib.auth.models import AbstractUser

from django.template.defaultfilters import slugify
import random


# --------------------------------------------------------------------------- #
# CHARACTERS INFORMATIONS                                                     #
# --------------------------------------------------------------------------- #

class CharacterClass(models.Model):
    name = models.CharField(max_length=30, unique=True)
    description = models.TextField(help_text="Not Required", blank=True)
    hp = models.PositiveIntegerField(help_text="Maximum 20")
    atk = models.PositiveIntegerField(help_text="Maximum 20")
    defense = models.PositiveIntegerField(help_text="Maximum 20")
    actions = models.ManyToManyField('blablapp.Action')

    # TODO: add default basic actions

    class Meta:
        verbose_name = 'Character Class'
        verbose_name_plural = 'Character Classes'


class Character(models.Model):
    characterClassId = models.ForeignKey(
        CharacterClass, on_delete=models.RESTRICT)
    userId = models.ForeignKey("blablapp.MyUser", on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    background = models.TextField(help_text="Not Required", blank=True)
    image = models.ImageField(
        help_text="Upload a character image", upload_to="characters")

    class Meta:
        verbose_name = 'Character'
        verbose_name_plural = 'Characters'

# --------------------------------------------------------------------------- #
# ACTIONS INFORMATIONS                                                        #
# --------------------------------------------------------------------------- #


class Action(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(help_text="Not Required", blank=True)
    trigger = models.CharField(max_length=10, unique=True)

    class Meta:
        verbose_name = 'Action'
        verbose_name_plural = 'Actions'

# --------------------------------------------------------------------------- #
# USERS INFORMATIONS                                                          #
# --------------------------------------------------------------------------- #


class MyUser(AbstractUser):
    """remove almost all blanks later"""
    nickname = models.CharField(max_length=30)
    unique_id = models.SlugField(
        verbose_name="User ID", null=True, max_length=255, unique=True, editable=False)
    profile_pic = models.ImageField(
        verbose_name="Profile Picture",
        help_text="Upload a profile picture",
        default='profile_pics/default.jpg',
        upload_to='profile_pics')
    birthdate = models.DateField()
    last_edit = models.DateTimeField(auto_now=True, blank=True)
    # characters = models.ManyToManyField(Character, blank=True)

    def save(self, *args, **kwargs):
        self.unique_id = slugify(
            (f'{self.nickname}-' + ''.join([str(random.randint(0, 9)) for _ in range(3)])))

        super(MyUser, self).save(*args, **kwargs)

    REQUIRED_FIELDS = ["nickname", "birthdate"]


class Contact(models.Model):
    senderId = models.ForeignKey(
        MyUser, related_name="ContactSender", on_delete=models.CASCADE)
    receiverId = models.ForeignKey(
        MyUser, related_name="ContactReceiver", on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)
    sentAt = models.DateTimeField(auto_now_add=True, editable=False)
    approvedAt = models.DateTimeField(null=True)
    refusedAt = models.DateTimeField(null=True)

    class Meta:
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"


class Tickbox(models.Model):
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editAt = models.DateTimeField(auto_now=True, blank=True)
    checked = models.BooleanField(default=False)
    userId = models.OneToOneField(
        MyUser, on_delete=models.CASCADE, primary_key=True)

    class Meta:
        verbose_name = "Tickbox"
        verbose_name_plural = "Tickboxes"


# --------------------------------------------------------------------------- #
# STORY & ENTITY                                                              #
# --------------------------------------------------------------------------- #


class AbstractEntity(models.Model):
    name = models.CharField(max_length=30)
    image = models.ImageField(
        help_text="Upload a Creature / NPC picture", upload_to="entities", blank=True)
    hp = models.PositiveIntegerField(help_text="Maximum 20")
    atk = models.PositiveIntegerField(help_text="Maximum 20")
    defense = models.PositiveIntegerField(help_text="Maximum 20")

    class Meta:
        verbose_name = "Entity"
        verbose_name_plural = "Entities"
        abstract = True


class Entity(AbstractEntity):
    trigger = models.CharField(max_length=10, unique=True)


class EntityInstance(AbstractEntity):
    instance_id = models.AutoField(primary_key=True)
    roomId = models.ForeignKey(
        "blablapp.Room", on_delete=models.CASCADE, null=True)
    currentHP = models.PositiveIntegerField(
        help_text="Not Required", null=True)
    currentATK = models.PositiveIntegerField(
        help_text="Not Required", null=True)
    currentDEF = models.PositiveIntegerField(
        help_text="Not Required", null=True)

    trigger = models.CharField(max_length=10)

    def save(self, *args, **kwargs):
        """
        Set the currentHP according to whats injected
        **kwargs = if the items is called EntityInstance(currentHP=<number>)
        It will cover three basic scenarios: set new value, default, and modification
        """
        if kwargs.get('currentHP'):
            self.currentHP = kwargs.get('currentHP')
        elif not self.currentHP:
            self.currentHP = self.hp

        if kwargs.get('currentATK'):
            self.currentATK = kwargs.get('currentATK')
        elif not self.currentATK:
            self.currentATK = self.atk

        if kwargs.get('currentDEF'):
            self.currentDEF = kwargs.get('currentDEF')
        elif not self.currentDEF:
            self.currentDEF = self.defense

        super(EntityInstance, self).save(*args, **kwargs)


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(help_text="Not Required", blank=True)
    content = models.TextField()
    image = models.ImageField(
        help_text="Upload a picture for your Event", upload_to="events", blank=True)
    # chronology = models.IntegerField(help_text="Event order in a Story")
    trigger = models.CharField(max_length=10, unique=True)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"


class Story(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(help_text="Not Required", blank=True)
    image = models.ImageField(
        help_text="Upload a picture for your Story", upload_to="stories", blank=True)
    optimalPlayers = models.PositiveIntegerField(verbose_name="Optimal Number of Players",
                                                 help_text="Optimal number of players for this story.")
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    deletedAt = models.DateTimeField(null=True)
    deleted = models.BooleanField(default=False)
    trigger = models.CharField(max_length=10, unique=True)
    # triggerCount = models.IntegerField(blank=True)
    events = models.ManyToManyField(Event)
    entities = models.ManyToManyField(Entity)

    class Meta:
        verbose_name = "Story"
        verbose_name_plural = "Stories"


# --------------------------------------------------------------------------- #
# ROOM DETAILS                                                                #
# --------------------------------------------------------------------------- #


# room ---------------------------------------------------------------------- #

class Room(models.Model):
    storyId = models.ForeignKey(Story, on_delete=models.RESTRICT)
    title = models.CharField(max_length=30)
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    maxParticipants = models.PositiveIntegerField(
        verbose_name="Maximum Participants")
    isPublic = models.BooleanField(
        verbose_name="Room visibility", help_text="Change room visibility", default=False)

    class Meta:
        ordering = ["createdAt", "isPublic"]
        verbose_name = "Room"
        verbose_name_plural = "Rooms"


class RoomParticipant(models.Model):
    roomId = models.ForeignKey(Room, on_delete=models.CASCADE)
    userId = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    isAdmin = models.BooleanField(
        verbose_name="Is DM", help_text="Determine if the participant is the DM", default=False)
    nickname = models.CharField(
        help_text="By default the user nickname", max_length=35, null=True)
    characterId = models.ForeignKey(Character, verbose_name="Character", help_text="Choose your player",
                                    on_delete=models.RESTRICT)
    hit = models.IntegerField(
        verbose_name="Hit Point", help_text="Hit points taken by the participant", default=0)
    joinedAt = models.DateTimeField(auto_now_add=True, editable=False)
    updatedAt = models.DateTimeField(auto_now=True)
    leftAt = models.DateTimeField(null=True)
    kicked = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.nickname is None:
            self.nickname = self.userId.nickname
        super(RoomParticipant, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Room Participant"
        verbose_name_plural = "Room Participants"


# messages ------------------------------------------------------------------ #

class Message(models.Model):
    roomId = models.ForeignKey(Room, on_delete=models.CASCADE)
    senderId = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    messageContent = models.TextField(
        verbose_name="Message Content")
    image = models.ImageField(
        help_text="Add an image to your message", upload_to='messages', blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    deletedAt = models.DateTimeField(null=True)
    quoted = models.BooleanField(
        help_text="Is the message a quote?", default=False)
    whispered = models.BooleanField(
        help_text="Is the message a whisper?", default=False)
    edited = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    isTriggered = models.BooleanField(default=False)

    class Meta:
        ordering = ["roomId", "createdAt"]
        verbose_name = "Message"
        verbose_name_plural = "Messages"


# message mechanism --------------------------------------------------------- #


class Whisper(models.Model):
    messageId = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True)
    senderId = models.ForeignKey(
        MyUser, related_name="WhisperSender", on_delete=models.CASCADE)
    receiverId = models.ForeignKey(
        MyUser,  related_name="WhisperReceiver", on_delete=models.CASCADE)


class Quote(models.Model):
    messageId = models.OneToOneField(
        Message, related_name="QuoteSender", on_delete=models.CASCADE, primary_key=True)
    quotedId = models.ForeignKey(
        Message, related_name="QuoteReceiver", null=True,
        on_delete=models.SET_NULL)

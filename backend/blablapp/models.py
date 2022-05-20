import random

from django.db import models
from django.contrib.auth.models import AbstractUser

from django.template.defaultfilters import slugify


# --------------------------------------------------------------------------- #
# CHARACTERS INFORMATIONS                                                     #
# --------------------------------------------------------------------------- #

class CharacterClass(models.Model):
    name = models.CharField(max_length=30, unique=True)
    description = models.TextField(help_text="Not Required", blank=True)
    hp = models.PositiveIntegerField(help_text="Maximum 20")
    atk = models.PositiveIntegerField(help_text="Maximum 20")
    defense = models.PositiveIntegerField(help_text="Maximum 20")
    actions = models.ManyToManyField('blablapp.Action', related_name='classes')

    # TODO: add default basic actions

    class Meta:
        ordering = ["name"]
        verbose_name = 'Character Class'
        verbose_name_plural = 'Character Classes'

    def __str__(self):
        return self.name


class Character(models.Model):
    characterClass = models.ForeignKey(
        CharacterClass, on_delete=models.RESTRICT, related_name="characters")
    user = models.ForeignKey(
        "blablapp.MyUser", on_delete=models.CASCADE, related_name="characters")
    name = models.CharField(max_length=30)
    background = models.TextField(help_text="Not Required", blank=True)
    image = models.ImageField(
        help_text="Upload a character image", upload_to="characters")

    class Meta:
        ordering = ['user', 'characterClass']
        verbose_name = 'Character'
        verbose_name_plural = 'Characters'

    def __str__(self):
        return self.name


# --------------------------------------------------------------------------- #
# ACTIONS INFORMATIONS                                                        #
# --------------------------------------------------------------------------- #


class Action(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(help_text="Not Required", blank=True)
    trigger = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['title']
        verbose_name = 'Action'
        verbose_name_plural = 'Actions'

    def __str__(self):
        return self.title


# --------------------------------------------------------------------------- #
# USERS INFORMATIONS                                                          #
# --------------------------------------------------------------------------- #


class MyUser(AbstractUser):
    """remove almost all blanks later"""
    email = models.EmailField(unique=True)
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

    class Meta:
        ordering = ['-date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    REQUIRED_FIELDS = ["nickname", "birthdate"]

    def __str__(self):
        return self.username
        # request.user return this


class Contact(models.Model):
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="contacts")
    approved = models.BooleanField(default=False)
    sentAt = models.DateTimeField(auto_now_add=True, editable=False)
    approvedAt = models.DateTimeField(blank=True, null=True)
    refusedAt = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['sender', "approved"]
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"


class Tickbox(models.Model):
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editAt = models.DateTimeField(auto_now=True, blank=True)
    checked = models.BooleanField(default=False)
    user = models.OneToOneField(
        MyUser, on_delete=models.CASCADE, primary_key=True, related_name="tickboxes")

    class Meta:
        ordering = ["createdAt"]
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
        abstract = True

    def __str__(self):
        return self.name


class Entity(AbstractEntity):

    class Meta:
        verbose_name = "Entity"
        verbose_name_plural = "Entities"


class EntityInstance(AbstractEntity):
    instance = models.AutoField(primary_key=True)
    entity = models.ForeignKey(
        Entity, on_delete=models.CASCADE, related_name="instances")
    room = models.ForeignKey(
        "blablapp.Room", on_delete=models.CASCADE, null=True, related_name="instances")
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

    class Meta:
        verbose_name = "Entity Instance"
        verbose_name_plural = "Entity Instances"
        unique_together = ('room', 'trigger')


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(help_text="Not Required", blank=True)
    content = models.TextField()
    image = models.ImageField(
        help_text="Upload a picture for your Event", upload_to="events", blank=True)
    # chronology = models.IntegerField(
    #     help_text="Event order in a Story", null=True)
    trigger = models.CharField(max_length=10, unique=True)
    # stories = models.ManyToManyField("blablapp.Story", related_name="events")
    # ajouter lien entre event et story

    class Meta:
        ordering = ['title']
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.title


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
    events = models.ManyToManyField(Event, related_name="stories")
    entities = models.ManyToManyField(Entity, related_name="stories")

    class Meta:
        ordering = ['title']
        verbose_name = "Story"
        verbose_name_plural = "Stories"

    def __str__(self):
        return self.title


# --------------------------------------------------------------------------- #
# ROOM DETAILS                                                                #
# --------------------------------------------------------------------------- #


# room ---------------------------------------------------------------------- #

class Room(models.Model):
    story = models.ForeignKey(
        Story, on_delete=models.RESTRICT, related_name="room")
    title = models.CharField(max_length=30)
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    maxParticipants = models.PositiveIntegerField(
        verbose_name="Maximum Participants")
    isPublic = models.BooleanField(
        verbose_name="Room visibility", help_text="Change room visibility", default=False)
    # ajouter deux fields + def save()
    # ajouter field => histoire terminée.

    class Meta:
        ordering = ["-isPublic", "createdAt"]
        verbose_name = "Room"
        verbose_name_plural = "Rooms"

    def __str__(self):
        return self.title


class RoomParticipant(models.Model):
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="rooms")
    isAdmin = models.BooleanField(
        verbose_name="Is DM", help_text="Determine if the participant is the DM", default=False)
    nickname = models.CharField(
        help_text="By default the user nickname", max_length=35, null=True)
    character = models.ForeignKey(Character, verbose_name="Character", help_text="Choose your player",
                                  on_delete=models.RESTRICT, related_name="rooms", blank=True, null=True)
    hit = models.IntegerField(
        verbose_name="Hit Point", help_text="Hit points taken by the participant", default=0)
    joinedAt = models.DateTimeField(auto_now_add=True, editable=False)
    updatedAt = models.DateTimeField(auto_now=True)
    leftAt = models.DateTimeField(null=True)
    kicked = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.nickname is None:
            self.nickname = self.user.nickname
        super(RoomParticipant, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Room Participant"
        verbose_name_plural = "Room Participants"

    def __str__(self):
        return self.nickname


# messages ------------------------------------------------------------------ #

class Message(models.Model):
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="messages", null=True)
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="messages")
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
        ordering = ["room", "createdAt"]
        verbose_name = "Message"
        verbose_name_plural = "Messages"

# message mechanism --------------------------------------------------------- #


class Whisper(models.Model):
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="whisper")
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="whispers")
    receiver = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="received_whispers")


class Quote(models.Model):
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="quotes")
    quoted = models.ForeignKey(
        Message, null=True,
        on_delete=models.SET_NULL, related_name="messages_quoted")

# OK ------------------------------------------------------------------------ #

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


# --------------------------------------------------------------------------- #
# TRACKING                                                   #
#
# class UserLoginActivity(models.Model):
#     SUCCESS = 'S'
#     FAILED = 'F'
#     LOGIN_STATUS = (
#         (SUCCESS, 'Success'),
#         (FAILED, 'Failed')
#     )
#     login_IP = models.GenericIPAddressField(null=True, blank=True)
#     login_datetime = models.DateTimeField(auto_now=True)
#     # use FK for this
#     login_username = models.CharField(max_length=40, null=True, blank=True)
#     status = models.CharField(max_length=1, default=SUCCESS, choices=LOGIN_STATUS, null=True, blank=True)
#     user_agent_info = models.CharField(max_length=255)

#     class Meta:
#         verbose_name = 'user_login_activity'
#         verbose_name_plural = 'user_login_activities'
# --------------------------------------------------------------------------- #
# CHARACTERS INFORMATIONS                                                     #
# --------------------------------------------------------------------------- #

class CharacterClass(models.Model):
    """Model: Character's Classes"""
    name = models.CharField(max_length=30, unique=True)
    description = models.TextField(help_text="Not Required", blank=True)
    hp = models.PositiveIntegerField(help_text="Maximum 20")
    atk = models.PositiveIntegerField(help_text="Maximum 20")
    defense = models.PositiveIntegerField(help_text="Maximum 20")
    actions = models.ManyToManyField('tales.Action', related_name='classes')

    class Meta:
        ordering = ["name"]
        verbose_name = 'Character Class'
        verbose_name_plural = 'Character Classes'

    def __str__(self):
        return self.name


class Character(models.Model):
    """Model: User's Character"""
    characterClass = models.ForeignKey(
        CharacterClass, on_delete=models.RESTRICT, related_name="characters")
    user = models.ForeignKey(
        "tales.MyUser", on_delete=models.CASCADE, related_name="characters")
    name = models.CharField(max_length=30)
    weapon = models.CharField(max_length=30, blank=True)
    background = models.TextField(help_text="Not Required", blank=True)
    image = models.ImageField(
        help_text="Upload a character image", upload_to="characters")

    class Meta:
        ordering = ['user', 'characterClass']
        verbose_name = 'Character'
        verbose_name_plural = 'Characters'


# --------------------------------------------------------------------------- #
# ACTIONS INFORMATIONS                                                        #
# --------------------------------------------------------------------------- #


class Action(models.Model):
    """Model: Class' Actions"""
    title = models.CharField(max_length=30)
    description = models.TextField(help_text="Not Required", blank=True)
    trigger = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['title']
        verbose_name = 'Action'
        verbose_name_plural = 'Actions'

    def __str__(self):
        return self.trigger


# --------------------------------------------------------------------------- #
# USERS INFORMATIONS                                                          #
# --------------------------------------------------------------------------- #


class MyUser(AbstractUser):
    """Model: User declinaison using AbstractUser"""
    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)

    profile_pic = models.ImageField(
        verbose_name="Profile Picture",
        help_text="Upload a profile picture",
        default='profile_pics/default.jpg',
        upload_to='profile_pics')
    birthdate = models.DateTimeField(blank=True, null=True)
    last_edit = models.DateTimeField(auto_now=True, blank=True)
    last_activity = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    REQUIRED_FIELDS = ["nickname", "birthdate"]

    def __str__(self):
        return self.username


class Contact(models.Model):
    """Model: List of contacts"""
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="contacts")
    approved = models.BooleanField(default=False)
    sentAt = models.DateTimeField(auto_now_add=True, editable=False)
    approvedAt = models.DateTimeField(blank=True, null=True)
    refusedAt = models.DateTimeField(blank=True, null=True)
    deletedAt = models.DateTimeField(blank=True, null=True)
    deletedBy = models.ForeignKey(
        MyUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='deleter')

    class Meta:
        ordering = ['sender', "approved"]
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
        unique_together = ("sender", "receiver")

    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError("User can't add themselves")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class Tickbox(models.Model):
    """Model: RGPD's Tickbox"""
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
    """AbstractEntity: Canvas for Entity & Instance creation"""
    name = models.CharField(max_length=30)
    image = models.ImageField(
        help_text="Upload a Creature / NPC picture", upload_to="entities", blank=True)
    hp = models.PositiveIntegerField(help_text="Maximum 20")
    atk = models.PositiveIntegerField(help_text="Maximum 20")
    defense = models.PositiveIntegerField(help_text="Maximum 20")
    isPublic = models.BooleanField(
        verbose_name="Entity visibility", help_text="Change entity visibility", default=False)

    class Meta:
        abstract = True


class Entity(AbstractEntity):
    """Model: Entity, can be associated to a story"""
    user = models.ForeignKey(
        MyUser, blank=True, null=True, on_delete=models.SET_NULL, related_name="entities")
    trigger = models.CharField(max_length=10)

    class Meta:
        verbose_name = "Entity"
        verbose_name_plural = "Entities"
        unique_together = ('user', 'trigger')

    def __str__(self):
        return self.trigger


class EntityInstance(AbstractEntity):
    """Model: Instance of an Entity"""
    instance = models.AutoField(primary_key=True)
    entity = models.ForeignKey(
        Entity, on_delete=models.CASCADE, related_name="instances")
    room = models.ForeignKey(
        "tales.Room", on_delete=models.CASCADE, null=True, related_name="instances")
    currentHP = models.PositiveIntegerField(
        help_text="Not Required", null=True)
    currentATK = models.PositiveIntegerField(
        help_text="Not Required", null=True)
    currentDEF = models.PositiveIntegerField(
        help_text="Not Required", null=True)
    trigger = models.CharField(max_length=15, blank=True, null=True)

    def save(self, *args, **kwargs):
        """
        Set the currentHP according to whats injected
        **kwargs = if the items are called like this: EntityInstance(currentHP=<number>)
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

        if self.trigger is None:
            self.trigger = f'{self.entity.trigger}-{self.instance}'

        super(EntityInstance, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Entity Instance"
        verbose_name_plural = "Entity Instances"
        unique_together = ('room', 'trigger')

    def __str__(self):
        return self.trigger


class Event(models.Model):
    """Model: Events, can be associated to a story"""
    user = models.ForeignKey(
        MyUser, blank=True, null=True, on_delete=models.SET_NULL, related_name="events")
    title = models.CharField(max_length=100)
    description = models.TextField(help_text="Not Required", blank=True)
    content = models.TextField()
    image = models.ImageField(
        help_text="Upload a picture for your Event", upload_to="events", blank=True)
    isPublic = models.BooleanField(
        verbose_name="Event visibility", help_text="Change event visibility", default=False)

    trigger = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['title']
        verbose_name = "Event"
        verbose_name_plural = "Events"
        unique_together = ('user', 'trigger')

    def __str__(self):
        return self.trigger


class Story(models.Model):
    """Model: Story"""
    user = models.ForeignKey(
        MyUser, blank=True, null=True, on_delete=models.SET_NULL, related_name="stories")
    title = models.CharField(max_length=100)
    description = models.TextField(help_text="Not Required", blank=True)
    image = models.ImageField(
        help_text="Upload a picture for your Story", upload_to="stories", blank=True)
    optimalPlayers = models.PositiveIntegerField(verbose_name="Optimal Number of Players",
                                                 help_text="Optimal number of players for this story.")
    storyDifficulty = models.CharField(
        help_text="Story difficulty", max_length=15, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    deletedAt = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField(default=False)
    isPublic = models.BooleanField(
        verbose_name="Story visibility", help_text="Change story visibility", default=False)

    events = models.ManyToManyField(Event, related_name="stories")
    entities = models.ManyToManyField(Entity, related_name="stories")

    trigger = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['title']
        verbose_name = "Story"
        verbose_name_plural = "Stories"
        unique_together = ('user', 'trigger')

    def __str__(self):
        return self.trigger


# --------------------------------------------------------------------------- #
# ROOM DETAILS                                                                #
# --------------------------------------------------------------------------- #


# room ---------------------------------------------------------------------- #

class Room(models.Model):
    """Model: Room"""
    story = models.ForeignKey(
        Story, on_delete=models.RESTRICT, related_name="room")
    title = models.CharField(max_length=30)
    description = models.TextField(help_text="Not Required", blank=True)
    maxParticipants = models.PositiveIntegerField(
        verbose_name="Maximum Participants")
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    isPublic = models.BooleanField(
        verbose_name="Room visibility", help_text="Change room visibility", default=False)
    isClosed = models.BooleanField(
        verbose_name="Room state", help_text="Change room state", default=False)

    class Meta:
        ordering = ["-isPublic", "createdAt"]
        verbose_name = "Room"
        verbose_name_plural = "Rooms"

    def save(self, *args, **kwargs):

        if kwargs.get('description'):
            self.description = kwargs.get('description')
        elif not self.description:
            self.description = self.story.description

        if kwargs.get('maxParticipants'):
            self.maxParticipants = kwargs.get('maxParticipants')
        elif not self.maxParticipants:
            self.maxParticipants = self.story.optimalPlayers

        super().save(*args, **kwargs)


class RoomParticipant(models.Model):
    """Model: Room Participant"""

    # TODO -> add accepted booleanField for acceptance logic
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
    leftAt = models.DateTimeField(blank=True, null=True)
    kicked = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):

        if kwargs.get('nickname'):
            self.nickname = kwargs.get('nickname')
        elif not self.nickname:
            self.nickname = self.user.nickname
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Room Participant"
        verbose_name_plural = "Room Participants"
        unique_together = ('room', 'user')


# messages ------------------------------------------------------------------ #

class Message(models.Model):
    """Model: Message"""
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="messages")
    messageContent = models.TextField(
        verbose_name="Message Content")
    image = models.ImageField(
        help_text="Add an image to your message", upload_to='messages', blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, editable=False)
    editedAt = models.DateTimeField(auto_now=True)
    deletedAt = models.DateTimeField(blank=True, null=True)
    quoted = models.BooleanField(
        help_text="Is the message a quote?", default=False)
    whispered = models.BooleanField(
        help_text="Is the message a whisper?", default=False)
    edited = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    isTriggered = models.BooleanField(default=False)

    class Meta:
        ordering = ["room", "-createdAt"]
        verbose_name = "Message"
        verbose_name_plural = "Messages"


# message mechanism --------------------------------------------------------- #

class Whisper(models.Model):
    """Model: Whisper"""
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="whisper")
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="whispers")
    receiver = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="received_whispers")


class Quote(models.Model):
    """Model: Quote"""
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="quotes")
    quoted = models.ForeignKey(
        Message, null=True,
        on_delete=models.SET_NULL, related_name="messages_quoted")

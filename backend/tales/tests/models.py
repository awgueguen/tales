# OK ------------------------------------------------------------------------ #

from model_bakery import baker
from pprint import pprint
from django.test import TestCase
from tales.models import CharacterClass, Character, Action, MyUser, Contact, Tickbox, Entity, EntityInstance, Event, Story, Room, RoomParticipant, Message, Whisper, Quote


class TestModels(TestCase):
    """Set of multiple tests cases"""

    def test_class_has_an_action(self):
        """ManyToMany test between Action & CharacterClass"""
        character_class = CharacterClass.objects.create(
            name="Rogue", hp=10, atk=10, defense=10)
        search = Action.objects.create(title="Search", trigger="search")
        trap = Action.objects.create(title="Trap", trigger="trap")
        character_class.actions.set([search.pk, trap.pk])
        self.assertEqual(character_class.actions.count(), 2)

    def test_room_participant_model(self):
        """Test Seeding the models"""
        character_class = baker.make(CharacterClass)
        character = baker.make(Character)
        action = baker.make(Action)
        user = baker.make(MyUser)
        contact = baker.make(Contact)
        tickbox = baker.make(Tickbox)
        entity = baker.make(Entity)
        entity_instance = baker.make(EntityInstance)
        event = baker.make(Event)
        story = baker.make(Story)
        room = baker.make(Room)
        room_participant = baker.make(RoomParticipant)
        message = baker.make(Message)
        whisper = baker.make(Whisper)
        quote = baker.make(Quote)

        # Whisper ----------------------------------------------------------- #
        pprint(whisper.__dict__)
        # Quote ------------------------------------------------------------- #
        pprint(quote.__dict__)
        # Message ----------------------------------------------------------- #
        pprint(message.__dict__)
        # Room -------------------------------------------------------------- #
        pprint(room.__dict__)
        # Room Participant -------------------------------------------------- #
        pprint(room_participant.__dict__)
        # Story ------------------------------------------------------------- #
        pprint(story.__dict__)
        # Event ------------------------------------------------------------- #
        pprint(event.__dict__)
        # Entity Instance --------------------------------------------------- #
        pprint(entity_instance.__dict__)
        # Entity ------------------------------------------------------------ #
        pprint(entity.__dict__)
        # Tickbox ----------------------------------------------------------- #
        pprint(tickbox.__dict__)
        # Contact ----------------------------------------------------------- #
        pprint(contact.__dict__)
        # User -------------------------------------------------------------- #
        pprint(user.__dict__)
        # Action ------------------------------------------------------------ #
        pprint(action.__dict__)
        # Character --------------------------------------------------------- #
        pprint(character.__dict__)
        # Character Class --------------------------------------------------- #
        pprint(character_class.__dict__)

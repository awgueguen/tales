from django.test import TestCase
from blablapp.models import CharacterClass, Action


class TestModels(TestCase):
    """Test ManyToMany between Actions & CharacterClass"""

    def test_class_has_an_action(self):
        """Define some data"""
        character_class = CharacterClass.objects.create(
            name="Rogue", hp=10, atk=10, defense=10)
        search = Action.objects.create(title="Search", trigger="search")
        trap = Action.objects.create(title="Trap", trigger="trap")
        character_class.actions.set([search.pk, trap.pk])
        self.assertEqual(character_class.actions.count(), 2)

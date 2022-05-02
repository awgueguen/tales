from django.test import TestCase
from blablapp.models import CharacterClass, Action


class TestModels(TestCase):
    def test_class_has_an_action(self):
        characterClass = CharacterClass.objects.create(
            name="Rogue", hp=10, atk=10, defense=10)
        search = Action.objects.create(title="Search", trigger="search")
        trap = Action.objects.create(title="Trap", trigger="trap")
        characterClass.actions.set([search.pk, trap.pk])
        self.assertEqual(characterClass.actions.count(), 2)

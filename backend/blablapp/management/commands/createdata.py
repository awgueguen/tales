from django.core.management.base import BaseCommand
from blablapp.models import *
from faker import Faker
import random


class Command(BaseCommand):
    help = "Command information"
    Faker.seed(0)

    def handle(self, *args, **kwargs):

        fake = Faker(["en_US"])

        cl_input = int(input(">>> how many classes: "))
        for _ in range(cl_input):
            flag = True
            while flag:
                n = fake.unique.job()
                if len(n) < 30:
                    flag = False

            CharacterClass.objects.create(
                name=n,
                description=fake.text(max_nb_chars=120),
                hp=random.randint(1, 20),
                atk=random.randint(1, 20),
                defense=random.randint(1, 20),
            )

        check_classes = CharacterClass.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'Number of Classes: {check_classes}'))

        for _ in range(cl_input // 2):
            Character.objects.create(
                characterClassId=CharacterClass.objects.order_by("?").first(),
                name=fake.name(),
                background=fake.text(max_nb_chars=400),
                image=fake.image_url(),
            )

        check_charac = Character.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'Number of Character: {check_charac}'))

        a_input = input(">>> how many actions:")

# class Action(models.Model):
#     title = models.CharField(max_length=30)
#     description = models.TextField(help_text="Not Required", blank=True)
#     trigger = models.CharField(max_length=10, unique=True)

#     class Meta:
#         verbose_name = 'Action'
#         verbose_name_plural = 'Actions'

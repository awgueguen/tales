from django.core.management.base import BaseCommand
from blablapp.models import *
# import faker.providers
from faker import Faker
import random

ACTIONS = ["Attack", "Hide", "Search", "Use", "Talk", "Charm", "Trap"]


def loadbar(iteration, total, decimals=1, length=100, fill='█'):
    percent = ('{0:.' + str(decimals) +
               'f}').format(100 * iteration/float(total))
    filledLen = int(length * iteration // total)
    bar = fill * filledLen + '-' * (length - filledLen)
    print(f'\rProgress: |{bar}| {percent}% Complete', end='\r')
    if iteration == total:
        print()


# class Provider(faker.providers.BaseProvider):
#     def actions_type(self):
#         return self.random_element(ACTIONS)


class Command(BaseCommand):

    # Faker.seed(0)

    def handle(self, *args, **kwargs):

        fake = Faker(["en_US"])
        # fake.add_provider(Provider)

        cl_input = int(input(">>> how many classes: "))
        loadbar(0, cl_input)
        for i in range(cl_input):
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
            loadbar(i + 1, cl_input)

        check_classes = CharacterClass.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'Number of Classes: {check_classes}\n'))

        loadbar(0, len(ACTIONS))
        for i in range(len(ACTIONS)):
            Action.objects.create(
                title=ACTIONS[i],
                description=fake.sentence(nb_words=10),
                trigger=f'{ACTIONS[i][:3]}{fake.hex_color()}'
            )
            loadbar(i + 1, len(ACTIONS))

        check_actions = Action.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'Number of Actions: {check_actions}\n'))

        loadbar(0, cl_input)
        for i in range(cl_input):
            clid = CharacterClass.objects.order_by("?").first()
            acid = Action.objects.order_by("?").first()

            Character.objects.create(
                characterClassId=clid,
                name=fake.name(),
                background=fake.text(max_nb_chars=400),
                image=fake.image_url(),
            )

            clid.actions.set([acid.pk])
            loadbar(i + 1, cl_input)

        check_characters = Character.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'Number of Characters: {check_characters}\n'))

"""CLEAN CODE"""

import contextlib
import os
import random
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db.models import Q
from faker import Faker
import faker.providers
from blablapp.models import CharacterClass, Character, Action, MyUser, Contact, Tickbox, Entity, EntityInstance, Event, Story, Room, RoomParticipant, Message, Whisper, Quote  # pylint: disable=import-error


APP_URL = Path(__file__).resolve().parent.parent.parent.parent.parent


ACTIONS = ["Hide", "Search", "Charm", "Trap"]
DEFAULT_ACTIONS = ["Attack", "Use", "Talk"]


# blogs = Blog.objects.filter(author=author).values_list('id', flat=True)
# action = Action.objects.get(title=action_sample) -> return trigger
# action.id -> return action_id
# user_id = MyUser.objects.order_by("?").values('id', 'characters')


def images_list(folder_name):
    """Return a list of images in a folder"""
    return [f for f in os.listdir(os.path.join(APP_URL, 'frontend', 'media', folder_name))
            if os.path.isfile(os.path.join(APP_URL, 'frontend', 'media', folder_name, f))]


def loadbar(iteration, total, decimals=1, length=100, fill='█'):
    percent = ('{0:.' + str(decimals) +
               'f}').format(100 * iteration/float(total))
    filledLen = int(length * iteration // total)
    bar = fill * filledLen + '-' * (length - filledLen)
    print(f'\rProgress: |{bar}| {percent}% Complete', end="", flush=True)
    if iteration == total:
        print()


class Provider(faker.providers.BaseProvider):
    def action_type(self):
        return self.random_element(ACTIONS)

    def img_char(self):
        return self.random_element(images_list('characters'))

    def img_ent(self):
        return self.random_element(images_list('entities'))

    def img_event(self):
        return self.random_element(images_list('events'))

    def img_mess(self):
        return self.random_element(images_list('messages'))

    def img_prof(self):
        return self.random_element(images_list('profile_pics'))

    def img_story(self):
        return self.random_element(images_list('stories'))


class Command(BaseCommand):

    def handle(self, *args, **kwargs):  # sourcery no-metrics

        print(">>> reset db")
        os.system('python manage.py flush --noinput')
        print(">>> db flushed\n")

        fake = Faker(["en_US"])
        fancyfake = Faker(["nl_NL"])
        fake.add_provider(Provider)

        # ------------------------------------------------------------------- #
        # GAMEPLAY RELATED                                                    #
        # ------------------------------------------------------------------- #

        # actions ----------------------------------------------------------- #
        for j in DEFAULT_ACTIONS:
            action = Action.objects.create(
                title=j,
                description=fake.text(max_nb_chars=120),
                trigger=f'{j[:4]}-{random.randint(1,99)}'
            )

        for j in ACTIONS:
            action = Action.objects.create(
                title=j,
                description=fake.text(max_nb_chars=120),
                trigger=f'{j[:4]}-{random.randint(1,99)}'
            )

        # classes ----------------------------------------------------------- #
        loadbar(0, 5)
        for i in range(5):
            flag = True
            while flag:
                n = fake.unique.job()
                if len(n) < 30:
                    flag = False

            cclass = CharacterClass.objects.create(
                name=n,
                description=fake.text(max_nb_chars=120),
                hp=random.randint(1, 20),
                atk=random.randint(1, 20),
                defense=random.randint(1, 20),
            )

            actions = Action.objects.filter(
                title__in=DEFAULT_ACTIONS).values_list('id', flat=True)
            for j in actions:
                cclass.actions.add(j)

            action_sample = random.choice(ACTIONS)
            action = Action.objects.get(title=action_sample)
            cclass.actions.add(action)

            fake.unique.clear()
            loadbar(i + 1, 5)

        # results ----------------------------------------------------------- #
        check_classes = CharacterClass.objects.all().count()
        check_actions = Action.objects.all().count()

        self.stdout.write(self.style.SUCCESS(
            f'# Number of Classes: {check_classes}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Actions: {check_actions}\n'))

        # ------------------------------------------------------------------- #
        # USER RELATED                                                        #
        # ------------------------------------------------------------------- #

        user_input = int(input(">>> How many users: ") or "20")
        # user & tickbox ---------------------------------------------------- #
        loadbar(0, user_input)
        f = open("./blablapp/password.txt",
                 "w+", encoding="utf-8")
        for i in range(user_input):
            login = fake.unique.user_name()
            password = fake.password(length=12)
            f.write(f'Login: {login} // Password: {password}\r\n')
            user = MyUser.objects.create(
                profile_pic=f'profile_pics/{fake.img_prof()}',
                nickname=fake.user_name(),
                birthdate=fake.past_date(),
                is_superuser=False,
                username=login,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.unique.ascii_email(),
                is_staff=False,
                is_active=True,
            )

            user.set_password(password)
            user.save()

            # tickbox ------------------------------------------------------- #
            Tickbox.objects.create(
                checked=True,
                user=user  # working even if we are using the username
            )

            # characters ---------------------------------------------------- #
            for _ in range(5):
                class_id = CharacterClass.objects.order_by("?").first()

                Character.objects.create(
                    image=f'characters/{fake.img_char()}',
                    characterClass=class_id,
                    user=user,
                    name=fake.name(),
                    background=fake.text(max_nb_chars=400),
                    weapon=fake.color_name()
                )

            loadbar(i + 1, user_input)
        f.close()
        # results ----------------------------------------------------------- #
        check_users = MyUser.objects.all().count()
        check_characters = Character.objects.all().count()

        self.stdout.write(self.style.SUCCESS(
            f'# Number of Users: {check_users}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Characters: {check_characters}\n'))

        # contact request --------------------------------------------------- #
        loadbar(0, user_input * 4)
        for i in range(user_input * 4):
            with contextlib.suppress(Exception):
                user_list = MyUser.objects.order_by("?")
                Contact.objects.create(
                    sender=user_list.first(),
                    receiver=user_list.last(),
                    approved=fake.boolean(chance_of_getting_true=75),
                )
            loadbar(i + 1, user_input * 4)

        check_contact = Contact.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Contact Requests: {check_contact}\n'))

        # ------------------------------------------------------------------- #
        # STORY RELATED                                                       #
        # ------------------------------------------------------------------- #

        story_input = int(input(">>> How many stories: ") or "15")
        # story ------------------------------------------------------------- #
        loadbar(0, story_input)
        for i in range(story_input):
            user = MyUser.objects.all().order_by("?").first()

            story_title = fake.sentence(nb_words=3, variable_nb_words=False)
            story = Story.objects.create(
                user=user,
                title=story_title,
                description=fake.sentence(nb_words=10),
                image=f'stories/{fake.img_story()}',
                optimalPlayers=random.randint(3, 5),
                isPublic=fake.boolean(chance_of_getting_true=15),
                trigger=f'{story_title[:4]}-{random.randint(1,99)}'
            )

            # events -------------------------------------------------------- #
            for _ in range(3):
                event_tittle = fake.sentence(
                    nb_words=3, variable_nb_words=False)

                event = Event.objects.create(
                    user=user,
                    title=event_tittle,
                    description=fake.sentence(nb_words=10),
                    content=fake.paragraph(nb_sentences=5),
                    image=f'events/{fake.img_event()}',
                    isPublic=fake.boolean(chance_of_getting_true=15),
                    trigger=f'{event_tittle[:4]}-{random.randint(1,99)}'
                )
                story.events.add(event)

            # entities ------------------------------------------------------ #
            for _ in range(2):
                flag = True
                while flag:
                    n = fancyfake.unique.name(),
                    if len(n[0]) < 25:
                        flag = False

                entity = Entity.objects.create(
                    image=f'entities/{fake.img_ent()}',
                    user=user,
                    name=n[0],
                    hp=random.randint(1, 20),
                    atk=random.randint(1, 20),
                    defense=random.randint(1, 20),
                    trigger=f'{n[0][:4]}-{random.randint(1,99)}'

                )
                story.entities.add(entity)

            loadbar(i + 1, story_input)

        # results ----------------------------------------------------------- #
        check_stories = Story.objects.all().count()
        check_events = Event.objects.all().count()
        check_entities = Entity.objects.all().count()

        self.stdout.write(self.style.SUCCESS(
            f'# Number of Stories: {check_stories}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Events: {check_events}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Entities: {check_entities}\n'
        ))

        # ------------------------------------------------------------------- #
        # ROOM RELATED                                                        #
        # ------------------------------------------------------------------- #

        room_input = int(input(">>> How many rooms: ") or "15")
        # room -------------------------------------------------------------- #
        loadbar(0, room_input)
        for i in range(room_input):
            story_id = Story.objects.order_by('?').first()

            random_void = random.randint(1, 3)

            room = Room.objects.create(
                story=story_id,
                title=fake.sentence(nb_words=3, variable_nb_words=False),
                maxParticipants=story_id.optimalPlayers,
                isPublic=fake.boolean(chance_of_getting_true=45)
            )

            user_ids = MyUser.objects.filter(~Q(id=story_id.user.id)).order_by(
                "?").values_list('id', flat=True)[:story_id.optimalPlayers - random_void]

            dm = MyUser.objects.get(id=story_id.user.id)

            RoomParticipant.objects.create(
                room=room,
                user=dm,
                isAdmin=True,
            )

            # participants -------------------------------------------------- #
            for j in user_ids:
                character = Character.objects.filter(
                    user=j).order_by("?").first()
                user = MyUser.objects.get(id=j)

                RoomParticipant.objects.create(
                    room=room,
                    user=user,
                    isAdmin=False,
                    character=character,
                )

            # entities instances -------------------------------------------- #
            entity = Entity.objects.order_by(
                "?").values_list('id', flat=True)[:3]

            for j in entity:
                instance = Entity.objects.get(id=j)
                instance_e = EntityInstance(
                    entity=instance,
                    room=room,
                )
                instance_e.__dict__.update(instance.__dict__)
                instance_e.save()

            # messages ------------------------------------------------------ #
            for _ in range(30):
                messages_users = RoomParticipant.objects.filter(
                    room=room).order_by("?").values_list('user', flat=True)

                sender = MyUser.objects.get(id=messages_users.first())
                receiver = MyUser.objects.get(id=messages_users.last())
                whisper = fake.boolean(chance_of_getting_true=10)
                quote = False if whisper else fake.boolean(
                    chance_of_getting_true=10)
                is_triggered = False if whisper or quote else fake.boolean(
                    chance_of_getting_true=10)

                random_nb = random.randint(1, 30)

                message = Message.objects.create(
                    room=room,
                    sender=sender,
                    messageContent=fake.sentence(nb_words=10),
                    quoted=quote,
                    whispered=whisper,
                    isTriggered=is_triggered,
                    image=f'messages/{fake.img_mess()}' if random_nb % 3 == 0 else ""
                )

                # whisper --------------------------------------------------- #
                if whisper:
                    Whisper.objects.create(
                        message=message,
                        sender=sender,
                        receiver=receiver
                    )

                # quote ----------------------------------------------------- #
                elif quote:
                    quote = Message.objects.all().first()
                    Quote.objects.create(
                        message=message,
                        quoted=quote
                    )

            loadbar(i + 1, room_input)

        check_rooms = Room.objects.all().count()
        check_participants = RoomParticipant.objects.all().count()
        check_instances = EntityInstance.objects.all().count()
        check_messages = Message.objects.all().count()
        check_whispers = Whisper.objects.all().count()
        check_quotes = Quote.objects.all().count()

        self.stdout.write(self.style.SUCCESS(
            f'# Number of Rooms: {check_rooms}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Participants: {check_participants}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Instances from multiple entities: {check_instances}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Messages: {check_messages}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Whisper: {check_whispers}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Quotes: {check_quotes}'))

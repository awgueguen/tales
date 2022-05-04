from django.core.management.base import BaseCommand
from blablapp.models import *
import faker.providers
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


class Provider(faker.providers.BaseProvider):
    def action_type(self):
        return self.random_element(ACTIONS)


class Command(BaseCommand):

    # Faker.seed(0)

    def handle(self, *args, **kwargs):  # sourcery no-metrics

        fake = Faker(["en_US"])
        fancyfake = Faker(["nl_NL"])
        fake.add_provider(Provider)

        # ------------------------------------------------------------------- #
        # GAMEPLAY RELATED                                                    #
        # ------------------------------------------------------------------- #

        # cl_input = int(input(">>> How many Class: "))
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

            # actions ------------------------------------------------------- #
            for _ in range(3):
                action = Action.objects.create(
                    title=fake.unique.action_type(),
                    description=fake.sentence(nb_words=10),
                    trigger=f'{ACTIONS[i][:3]}{fake.hex_color()}'  # FIXME
                )

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

        user_input = int(input(">>> How many users: "))
        # user & tickbox ---------------------------------------------------- #
        loadbar(0, user_input)
        for i in range(user_input):
            user = MyUser.objects.create(
                nickname=fake.user_name(),
                birthdate=fake.past_date(),
                # baseuser -------------------------------------------------- #
                password=fake.password(length=12),
                is_superuser=False,
                username=fake.unique.user_name(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.unique.ascii_email(),
                is_staff=False,
                is_active=True,
            )

            # tickbox ------------------------------------------------------- #
            Tickbox.objects.create(
                checked=True,
                userId=user
            )

            # characters ---------------------------------------------------- #
            for _ in range(3):
                user_id = user
                class_id = CharacterClass.objects.order_by("?").first()

                Character.objects.create(
                    characterClassId=class_id,
                    userId=user_id,
                    name=fake.name(),
                    background=fake.text(max_nb_chars=400),
                    image=fake.image_url(),
                )

            loadbar(i + 1, user_input)

        # results ----------------------------------------------------------- #
        check_users = MyUser.objects.all().count()
        check_characters = Character.objects.all().count()

        self.stdout.write(self.style.SUCCESS(
            f'# Number of Users: {check_users}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Characters: {check_characters}\n'))

        # contact request --------------------------------------------------- #
        loadbar(0, user_input // 2)
        for i in range(user_input // 2):
            user_list = MyUser.objects.order_by("?")
            Contact.objects.create(
                senderId=user_list.first(),
                receiverId=user_list.last(),
                approved=fake.boolean(chance_of_getting_true=75),
            )
            loadbar(i + 1, user_input // 2)

        check_contact = Contact.objects.all().count()
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Contact Requests: {check_contact}\n'))

        # ------------------------------------------------------------------- #
        # STORY RELATED                                                       #
        # ------------------------------------------------------------------- #

        # story ------------------------------------------------------------- #
        loadbar(0, 5)
        for i in range(5):
            story = Story.objects.create(
                title=fake.sentence(nb_words=3, variable_nb_words=False),
                description=fake.sentence(nb_words=10),
                image=fake.image_url(),
                optimalPlayers=random.randint(1, 5),
                trigger=fake.unique.hex_color()  # FIXME
            )

            # events -------------------------------------------------------- #
            for _ in range(5):
                event = Event.objects.create(
                    title=fake.sentence(nb_words=3, variable_nb_words=False),
                    description=fake.sentence(nb_words=10),
                    content=fake.paragraph(nb_sentences=5),
                    image=fake.image_url(),
                    trigger=fake.unique.hex_color()
                )
                story.events.add(event)

            # entities ------------------------------------------------------ #
            for _ in range(10):
                flag = True
                while flag:
                    n = fancyfake.unique.name(),
                    if len(n[0]) < 25:
                        flag = False

                entity = Entity.objects.create(
                    name=n[0],
                    image=fake.image_url(),
                    hp=random.randint(1, 20),
                    atk=random.randint(1, 20),
                    defense=random.randint(1, 20),
                    trigger=fake.unique.hex_color()
                )
                story.entities.add(entity)

            loadbar(i + 1, 5)

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

        room_input = int(input(">>> How many rooms: "))
        # room -------------------------------------------------------------- #
        loadbar(0, room_input)
        for i in range(room_input):
            story_id = Story.objects.order_by('?').first()
            max_players = random.randint(1, 5)

            room = Room.objects.create(
                storyId=story_id,
                title=fake.sentence(nb_words=3, variable_nb_words=False),
                maxParticipants=max_players,
                isPublic=fake.boolean(chance_of_getting_true=25)
            )

            user_id = MyUser.objects.order_by("?").values(
                'id', 'character')[:max_players]

            # participants -------------------------------------------------- #
            for j in range(len(user_id)):
                user = MyUser.objects.get(id__exact=user_id[j]["id"])
                character = Character.objects.get(
                    id__exact=user_id[j]["character"])

                admin = j == 0
                RoomParticipant.objects.create(
                    roomId=room,
                    userId=user,
                    isAdmin=admin,
                    characterId=character,
                )

            # messages ------------------------------------------------------ #
            for _ in range(30):
                all_user = MyUser.objects.order_by("?")
                sender = all_user.first()
                receiver = all_user.last()
                whisper = fake.boolean(chance_of_getting_true=10)
                quote = False if whisper else fake.boolean(
                    chance_of_getting_true=10)
                is_triggered = False if whisper or quote else fake.boolean(
                    chance_of_getting_true=20)

                message = Message.objects.create(
                    roomId=room,
                    senderId=sender,
                    messageContent=fake.sentence(nb_words=10),
                    quoted=quote,
                    whispered=whisper,
                    isTriggered=is_triggered,
                )

                # whisper --------------------------------------------------- #
                if whisper:
                    Whisper.objects.create(
                        messageId=message,
                        senderId=sender,
                        receiverId=receiver
                    )

                # quote ----------------------------------------------------- #
                elif quote:
                    quote = Message.objects.all().first()
                    Quote.objects.create(
                        messageId=message,
                        quotedId=quote
                    )

                    # TODO FIX => ENITY INSTANCE

                    # for _ in range(3):
                    #     entity = Entity.objects.order_by("?").first()
                    #     EntityInstance.objects.create(
                    #         entity_ptr_id=entity.pk,
                    #         roomId=room
                    #     )

            loadbar(i + 1, room_input)

        check_rooms = Room.objects.all().count()
        check_participants = RoomParticipant.objects.all().count()
        check_messages = Message.objects.all().count()
        check_whispers = Whisper.objects.all().count()
        check_quotes = Quote.objects.all().count()

        self.stdout.write(self.style.SUCCESS(
            f'# Number of Rooms: {check_rooms}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Participants: {check_participants}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Messages: {check_messages}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Whisper: {check_whispers}'))
        self.stdout.write(self.style.SUCCESS(
            f'# Number of Quotes: {check_quotes}'))

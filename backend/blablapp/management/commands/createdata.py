from django.core.management.base import BaseCommand
from faker import Faker


class Command(BaseCommand):
    help = "Command information"

    def handle(self, *args, **kwargs):

        fake = Faker(["fr_FR"])

        print(fake.name())

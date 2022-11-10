import django.core.management.utils as dj


def randomkey():
    secret_key = dj.get_random_secret_key()

    with open('.env', 'w+', encoding='utf8') as f:
        f.write(f'DJANGO_SECRET_KEY = "{secret_key}"')


if __name__ == '__main__':
    randomkey()

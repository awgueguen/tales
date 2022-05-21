# Generated by Django 4.0.4 on 2022-05-20 23:17

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='MyUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('nickname', models.CharField(max_length=30)),
                ('profile_pic', models.ImageField(default='profile_pics/default.jpg', help_text='Upload a profile picture', upload_to='profile_pics', verbose_name='Profile Picture')),
                ('birthdate', models.DateField()),
                ('last_edit', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'ordering': ['-date_joined'],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('description', models.TextField(blank=True, help_text='Not Required')),
                ('trigger', models.CharField(max_length=10, unique=True)),
            ],
            options={
                'verbose_name': 'Action',
                'verbose_name_plural': 'Actions',
                'ordering': ['title'],
            },
        ),
        migrations.CreateModel(
            name='Entity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('image', models.ImageField(blank=True, help_text='Upload a Creature / NPC picture', upload_to='entities')),
                ('hp', models.PositiveIntegerField(help_text='Maximum 20')),
                ('atk', models.PositiveIntegerField(help_text='Maximum 20')),
                ('defense', models.PositiveIntegerField(help_text='Maximum 20')),
                ('isPublic', models.BooleanField(default=False, help_text='Change entity visibility', verbose_name='Entity visibility')),
                ('trigger', models.CharField(max_length=10)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='entities', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Entity',
                'verbose_name_plural': 'Entities',
                'unique_together': {('user', 'trigger')},
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, help_text='Not Required')),
                ('content', models.TextField()),
                ('image', models.ImageField(blank=True, help_text='Upload a picture for your Event', upload_to='events')),
                ('isPublic', models.BooleanField(default=False, help_text='Change event visibility', verbose_name='Event visibility')),
                ('trigger', models.CharField(max_length=10, unique=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='events', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Event',
                'verbose_name_plural': 'Events',
                'ordering': ['title'],
                'unique_together': {('user', 'trigger')},
            },
        ),
        migrations.CreateModel(
            name='Tickbox',
            fields=[
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('editAt', models.DateTimeField(auto_now=True)),
                ('checked', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='tickboxes', serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Tickbox',
                'verbose_name_plural': 'Tickboxes',
                'ordering': ['createdAt'],
            },
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, help_text='Not Required')),
                ('image', models.ImageField(blank=True, help_text='Upload a picture for your Story', upload_to='stories')),
                ('optimalPlayers', models.PositiveIntegerField(help_text='Optimal number of players for this story.', verbose_name='Optimal Number of Players')),
                ('storyDifficulty', models.CharField(blank=True, help_text='Story difficulty', max_length=15)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('editedAt', models.DateTimeField(auto_now=True)),
                ('deletedAt', models.DateTimeField(blank=True, null=True)),
                ('deleted', models.BooleanField(default=False)),
                ('isPublic', models.BooleanField(default=False, help_text='Change story visibility', verbose_name='Story visibility')),
                ('trigger', models.CharField(max_length=10, unique=True)),
                ('entities', models.ManyToManyField(related_name='stories', to='blablapp.entity')),
                ('events', models.ManyToManyField(related_name='stories', to='blablapp.event')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stories', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
                'ordering': ['title'],
                'unique_together': {('user', 'trigger')},
            },
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('editedAt', models.DateTimeField(auto_now=True)),
                ('maxParticipants', models.PositiveIntegerField(verbose_name='Maximum Participants')),
                ('isPublic', models.BooleanField(default=False, help_text='Change room visibility', verbose_name='Room visibility')),
                ('isClosed', models.BooleanField(default=False, help_text='Change room state', verbose_name='Room state')),
                ('story', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='room', to='blablapp.story')),
            ],
            options={
                'verbose_name': 'Room',
                'verbose_name_plural': 'Rooms',
                'ordering': ['-isPublic', 'createdAt'],
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('messageContent', models.TextField(verbose_name='Message Content')),
                ('image', models.ImageField(blank=True, help_text='Add an image to your message', upload_to='messages')),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('editedAt', models.DateTimeField(auto_now=True)),
                ('deletedAt', models.DateTimeField(blank=True, null=True)),
                ('quoted', models.BooleanField(default=False, help_text='Is the message a quote?')),
                ('whispered', models.BooleanField(default=False, help_text='Is the message a whisper?')),
                ('edited', models.BooleanField(default=False)),
                ('deleted', models.BooleanField(default=False)),
                ('isTriggered', models.BooleanField(default=False)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='blablapp.room')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Message',
                'verbose_name_plural': 'Messages',
                'ordering': ['room', 'createdAt'],
            },
        ),
        migrations.CreateModel(
            name='CharacterClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
                ('description', models.TextField(blank=True, help_text='Not Required')),
                ('hp', models.PositiveIntegerField(help_text='Maximum 20')),
                ('atk', models.PositiveIntegerField(help_text='Maximum 20')),
                ('defense', models.PositiveIntegerField(help_text='Maximum 20')),
                ('actions', models.ManyToManyField(related_name='classes', to='blablapp.action')),
            ],
            options={
                'verbose_name': 'Character Class',
                'verbose_name_plural': 'Character Classes',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Character',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('weapon', models.CharField(blank=True, max_length=30)),
                ('background', models.TextField(blank=True, help_text='Not Required')),
                ('image', models.ImageField(help_text='Upload a character image', upload_to='characters')),
                ('characterClass', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='characters', to='blablapp.characterclass')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='characters', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Character',
                'verbose_name_plural': 'Characters',
                'ordering': ['user', 'characterClass'],
            },
        ),
        migrations.CreateModel(
            name='Whisper',
            fields=[
                ('message', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='whisper', serialize=False, to='blablapp.message')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_whispers', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='whispers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RoomParticipant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isAdmin', models.BooleanField(default=False, help_text='Determine if the participant is the DM', verbose_name='Is DM')),
                ('nickname', models.CharField(help_text='By default the user nickname', max_length=35, null=True)),
                ('hit', models.IntegerField(default=0, help_text='Hit points taken by the participant', verbose_name='Hit Point')),
                ('joinedAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('leftAt', models.DateTimeField(blank=True, null=True)),
                ('kicked', models.BooleanField(default=False)),
                ('active', models.BooleanField(default=True)),
                ('character', models.ForeignKey(blank=True, help_text='Choose your player', null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='rooms', to='blablapp.character', verbose_name='Character')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='blablapp.room')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Room Participant',
                'verbose_name_plural': 'Room Participants',
                'unique_together': {('room', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Quote',
            fields=[
                ('message', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='quotes', serialize=False, to='blablapp.message')),
                ('quoted', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='messages_quoted', to='blablapp.message')),
            ],
        ),
        migrations.CreateModel(
            name='EntityInstance',
            fields=[
                ('name', models.CharField(max_length=30)),
                ('image', models.ImageField(blank=True, help_text='Upload a Creature / NPC picture', upload_to='entities')),
                ('hp', models.PositiveIntegerField(help_text='Maximum 20')),
                ('atk', models.PositiveIntegerField(help_text='Maximum 20')),
                ('defense', models.PositiveIntegerField(help_text='Maximum 20')),
                ('isPublic', models.BooleanField(default=False, help_text='Change entity visibility', verbose_name='Entity visibility')),
                ('instance', models.AutoField(primary_key=True, serialize=False)),
                ('currentHP', models.PositiveIntegerField(help_text='Not Required', null=True)),
                ('currentATK', models.PositiveIntegerField(help_text='Not Required', null=True)),
                ('currentDEF', models.PositiveIntegerField(help_text='Not Required', null=True)),
                ('trigger', models.CharField(blank=True, max_length=15, null=True)),
                ('entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='blablapp.entity')),
                ('room', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='blablapp.room')),
            ],
            options={
                'verbose_name': 'Entity Instance',
                'verbose_name_plural': 'Entity Instances',
                'unique_together': {('room', 'trigger')},
            },
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approved', models.BooleanField(default=False)),
                ('sentAt', models.DateTimeField(auto_now_add=True)),
                ('approvedAt', models.DateTimeField(blank=True, null=True)),
                ('refusedAt', models.DateTimeField(blank=True, null=True)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contacts', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Contact',
                'verbose_name_plural': 'Contacts',
                'ordering': ['sender', 'approved'],
                'unique_together': {('sender', 'receiver')},
            },
        ),
    ]

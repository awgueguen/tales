# Generated by Django 4.1.2 on 2022-12-15 10:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tales', '0002_myuser_last_activity_myuser_last_connexion'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='last_connexion',
        ),
    ]

# Generated by Django 4.0.4 on 2022-05-29 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blablapp', '0003_rename_story_description_room_description_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='title',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=models.CharField(max_length=30),
        ),
    ]

# Generated by Django 4.0.4 on 2022-05-02 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blablapp', '0002_alter_myuser_birthdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='birthdate',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='characters',
            field=models.ManyToManyField(blank=True, to='blablapp.character'),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='profile_pic',
            field=models.ImageField(default='uploads/profile_pics/default.jpg', upload_to='uploads/profile_pics'),
        ),
    ]

# Generated by Django 5.1.6 on 2025-03-29 19:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0003_alter_rooms_is_admitted'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Rooms',
            new_name='RoomBed',
        ),
        migrations.RenameField(
            model_name='allotment',
            old_name='room_id',
            new_name='room_bed_id',
        ),
    ]

# Generated by Django 5.0.1 on 2024-03-29 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quviapi', '0005_userdataset_delete_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdataset',
            name='token',
            field=models.IntegerField(default=200),
        ),
    ]

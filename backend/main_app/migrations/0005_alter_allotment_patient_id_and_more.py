# Generated by Django 5.1.6 on 2025-04-01 17:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0004_rename_rooms_roombed_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allotment',
            name='patient_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.patient'),
        ),
        migrations.AlterField(
            model_name='allotment',
            name='room_bed_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.roombed'),
        ),
        migrations.AlterField(
            model_name='department',
            name='head_doctor_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main_app.doctor'),
        ),
        migrations.AlterField(
            model_name='diagnosis',
            name='patient_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.patient'),
        ),
        migrations.AlterField(
            model_name='diagnosis',
            name='visiting_doctor_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.doctor'),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='department_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main_app.department'),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='diagnosis_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.diagnosis'),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='patient_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.patient'),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='prescribed_by_doctor_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.doctor'),
        ),
        migrations.AlterField(
            model_name='testprescribed',
            name='diagnosis_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='tests_prescribed', to='main_app.diagnosis'),
        ),
        migrations.AlterField(
            model_name='testprescribed',
            name='ordering_doctor_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.doctor'),
        ),
        migrations.AlterField(
            model_name='testprescribed',
            name='patient_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.patient'),
        ),
        migrations.AlterField(
            model_name='testprescribed',
            name='test_code',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.medicaltest'),
        ),
        migrations.CreateModel(
            name='PrescriptionDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('drug', models.CharField(max_length=100)),
                ('dosage', models.CharField(max_length=100)),
                ('method', models.CharField(max_length=100)),
                ('duration', models.CharField(max_length=100)),
                ('diagnosis_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.diagnosis')),
                ('patient_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.patient')),
                ('prescribed_by_doctor_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.doctor')),
                ('prescription_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main_app.prescription')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='PresciptionDetails',
        ),
    ]

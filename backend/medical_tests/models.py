from django.db import models

# table for all the tests conducted in the hospital
class MedicalTest(models.Model):
    # _id=models.AutoField(primary_key=True)
    test_code=models.CharField(primary_key=True, max_length=20, unique=True)
    name=models.CharField(max_length=100)
    short_name=models.CharField(max_length=20)
    description=models.TextField()
    preconditions=models.TextField()
    test_category=models.CharField(max_length=20) #e.g., Blood Tests, Imaging, Pathology, Cardiology, Neurology
    test_subcategory=models.CharField(max_length=20) #e.g., Complete Blood Count, X-ray, Biopsy, ECG, EEG
    test_parameters=models.JSONField() # test parameters with key value pairs of parameter name and reference range. e.g., {"Hemoglobin": "12-16 g/dL", "WBC": "4000-11000 cells/mcL"}
    sample_type=models.CharField(max_length=20) #e.g. Blood, Urine, Tissue, Swab
    turnaround_time=models.IntegerField() # in hours
    reference_range_format=models.CharField(max_length=20) #e.g. numerical range, positive/negative
    units=models.CharField(max_length=20)
    cost=models.DecimalField(max_digits=10, decimal_places=2)

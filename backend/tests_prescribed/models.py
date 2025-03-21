from django.db import models

# table for storing tests prescribed by doctors to patient(s)
class TestPrescribed(models.Model):
    test_code=models.ForeignKey('medical_tests.MedicalTest', on_delete=models.CASCADE)
    diagnosis_id=models.ForeignKey('diagnosis.Diagnosis', on_delete=models.CASCADE)
    patient_id=models.ForeignKey('patients.Patient', on_delete=models.CASCADE, default=None)
    ordering_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    test_date=models.DateField()
    test_time=models.TimeField()
    test_results=models.TextField()
    test_result_files=models.FileField(upload_to='test_results/', null=True, blank=True)
    comments=models.TextField()
    status=models.CharField(max_length=20) # pending, completed, cancelled

    def __str__(self) -> str:
        return f"Test {self.test_code.short_name} prescribed to patient {self.patient_id.name} by Dr. {self.ordering_doctor_id.name}" # pylint: disable=no-member

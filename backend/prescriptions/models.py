from django.db import models

# table for storing prescriptions by a doctor for a patient
class Prescription(models.Model):
    diagnosis_id=models.ForeignKey('diagnosis.Diagnosis', on_delete=models.CASCADE)
    patient_id=models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    prescribed_by_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    prescription_date=models.DateField()
    additional_notes=models.TextField()

    def __str__(self) -> str:
        return f"Prescription for patient {self.patient_id.name} by Dr. {self.prescribed_by_doctor_id.name} on date {self.prescription_date}"
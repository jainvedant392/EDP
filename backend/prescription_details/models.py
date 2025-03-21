from django.db import models

# table for storing multiple prescription details for a single prescription for a patient. 
class PresciptionDetails(models.Model):
    prescription_id=models.ForeignKey('prescriptions.Prescription', on_delete=models.CASCADE)
    diagnosis_id=models.ForeignKey('diagnosis.Diagnosis', on_delete=models.CASCADE)
    patient_id=models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    prescribed_by_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    drug=models.CharField(max_length=100)
    dosage=models.CharField(max_length=100)
    frequency=models.CharField(max_length=100)
    duration=models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"Prescription details for patient {self.patient_id.name} by Dr. {self.prescribed_by_doctor_id.name} for drug {self.drug}"
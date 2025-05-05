'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function AddDiagnosisPage() {
  const params = useParams()
  const [patientId, setPatientId] = useState('')
  const [doctor_id, setDoctorId] = useState('')
  const [patientData, setPatientData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formStep, setFormStep] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    patient_id: '',
    visiting_doctor_id: '',
    blood_pressure: '',
    SPo2: '',
    heart_rate: '',
    blood_sugar: '',
    diagnosis_summary: '',
    tests: [],
    uploadedTests: [],
    additional_notes: '',
    prescriptions: [{ drug: '', dosage: '', duration: '', method: '' }]
  })

  // Pills for tests taken
  const [selectedTests, setSelectedTests] = useState([])
  const availableTests = [
    'CBC Test',
    'Influenza Test',
    'Blood Glucose',
    'Lipid Panel',
    'Liver Function',
    'Kidney Function',
    'Thyroid Panel',
    'Urinalysis',
    'X-Ray',
    'ECG'
  ]

  useEffect(() => {
    // Get doctor ID from localStorage
    const fetchDoctorId = () => {
      try {
        const storedDoctorId = localStorage.getItem('doctor_id')
        if (storedDoctorId) {
          setDoctorId(storedDoctorId)
          setFormData(prev => ({
            ...prev,
            visiting_doctor_id: storedDoctorId
          }))
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error)
      }
    }
    
    // Get patient ID from URL params
    if (params.patientId) {
      setPatientId(params.patientId)
      setFormData(prev => ({
        ...prev,
        patient_id: params.patientId
      }))
      
      // Mock patient data - replace with API call
      const mockPatient = {
        id: params.patientId,
        name: 'Suresh Ramakrishnan',
        age: '42',
        gender: 'Male',
        history:
          'Bronchial asthma since childhood. Seasonal allergic rhinitis.',
        allergies: 'Dust, Pollen, Aspirin'
      }
      setPatientData(mockPatient)
      setIsLoading(false)
    }
    
    fetchDoctorId()
  }, [params.patientId])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTestSelection = test => {
    const updatedTests = selectedTests.includes(test)
      ? selectedTests.filter(t => t !== test)
      : [...selectedTests, test]
  
    setSelectedTests(updatedTests)
    setFormData(prev => ({
      ...prev,
      tests: updatedTests
    }))
  }
  
  const handleFileUpload = e => {
    const files = Array.from(e.target.files)
    const fileNames = files.map(file => file.name)

    setFormData(prev => ({
      ...prev,
      uploadedTests: [...prev.uploadedTests, ...fileNames]
    }))
  }

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions,
        { drug: '', dosage: '', duration: '', method: '' }
      ]
    }))
  }

  const updatePrescription = (index, field, value) => {
    const updatedPrescriptions = [...formData.prescriptions]
    updatedPrescriptions[index][field] = value

    setFormData(prev => ({
      ...prev,
      prescriptions: updatedPrescriptions
    }))
  }

  const handleSubmit = () => {
    // Get current date and time in required formats
    const now = new Date()
    
    // Format date as YYYY-MM-DD
    const diagnosis_date = now.toISOString().split('T')[0]
    
    // Format time in 24-hour format (HH:MM:SS)
    const diagnosis_time = now.toTimeString().split(' ')[0]
    
    // In a real app, submit to API
    // Make sure patientId, doctorId, date and time are included in the submission
    const dataToSubmit = {
      ...formData,
      patient_id: patientId,
      visiting_doctor_id: doctor_id,
      diagnosis_date,
      diagnosis_time
    }
    
    console.log('Form submitted:', dataToSubmit)

    // Show success state
    setIsSuccess(true)
  }

  const handleContinue = () => {
    setFormStep(2)
  }

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  // Success screen
  if (isSuccess) {
    return (
      <div className='flex min-h-screen flex-col'>
        {/* navbar */}
        <Navbar />

        <div className='flex flex-1 flex-col items-center justify-center'>
          <div className='mb-8 h-40 w-40 rounded-full bg-[#18B7CD]'>
            <div className='flex h-full w-full items-center justify-center'>
              <Check className='h-24 w-24 text-white' />
            </div>
          </div>
          <p className='mb-8 text-xl text-[#18B7CD]'>
            Diagnosis Registered Successfully
          </p>
          <Link
            href='/doctorDashboard'
            className='rounded-md bg-[#18B7CD] px-4 py-2 text-white hover:bg-[#149AAD]'
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col'>
      {/* navbar */}
      <Navbar />

      <div className='p-6'>
        <div className='mb-6'>
          <Link
            href='/doctorDashboard'
            className='flex items-center text-gray-600 hover:text-gray-800'
          >
            <ChevronLeft className='mr-2 h-5 w-5' />
            <span>Enter Patient Diagnosis</span>
          </Link>
        </div>

        {/* Patient basic info would appear here in a real app */}

        {/* Form Step 1 */}
        {formStep === 1 && (
          <div className='space-y-6'>
            {/* Vitals */}
            <div className='rounded-lg bg-[#E4F9FC] p-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <input
                    type='text'
                    name='blood_pressure'
                    className='w-full rounded border border-gray-300 p-2'
                    placeholder='Enter Blood Pressure'
                    value={formData.blood_pressure}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type='text'
                    name='blood_sugar'
                    className='w-full rounded border border-gray-300 p-2'
                    placeholder='Enter Blood Sugar'
                    value={formData.blood_sugar}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type='text'
                    name='SPo2'
                    className='w-full rounded border border-gray-300 p-2'
                    placeholder='Enter SPO2'
                    value={formData.SPo2}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type='text'
                    name='heart_rate'
                    className='w-full rounded border border-gray-300 p-2'
                    placeholder='Enter Heart Rate'
                    value={formData.heart_rate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className='rounded-lg border border-[#18B7CD] p-4'>
              <input
                type='text'
                name='diagnosis_summary'
                className='w-full rounded border border-gray-300 p-2'
                placeholder='Enter Patient Diagnosis'
                value={formData.diagnosis_summary}
                onChange={handleInputChange}
              />
            </div>

            {/* Tests */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-lg border border-[#18B7CD] p-4'>
                <div className='mb-2'>
                  <input
                    type='text'
                    className='w-full rounded border border-gray-300 p-2'
                    placeholder='Enter Tests taken'
                    disabled
                  />
                </div>
                <div className='flex flex-wrap gap-2'>
                  {availableTests.map((test, index) => (
                    <button
                      key={index}
                      className={`rounded-full px-3 py-1 text-sm ${
                        selectedTests.includes(test)
                          ? 'bg-[#18B7CD] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleTestSelection(test)}
                    >
                      {test}
                    </button>
                  ))}
                </div>
              </div>

              <div className='rounded-lg border border-[#18B7CD] p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Upload Test Results</span>
                  <label className='flex cursor-pointer items-center rounded-md bg-[#18B7CD] px-3 py-1 text-white hover:bg-[#149AAD]'>
                    <Upload className='mr-1 h-4 w-4' />
                    <span>Upload</span>
                    <input
                      type='file'
                      multiple
                      className='hidden'
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <div className='mt-2'>
                  {formData.uploadedTests.map((file, index) => (
                    <div key={index} className='text-sm text-gray-700'>
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className='flex justify-end'>
              <button
                className='flex items-center rounded-md bg-[#18B7CD] px-4 py-2 text-white hover:bg-[#149AAD]'
                onClick={handleContinue}
              >
                Continue
                <ChevronLeft className='ml-1 h-5 w-5 rotate-180' />
              </button>
            </div>
          </div>
        )}

        {/* Form Step 2 - Prescriptions */}
        {formStep === 2 && (
          <div className='space-y-6'>
            {/* Prescription Table */}
            <div className='overflow-x-auto rounded-lg border border-[#18B7CD]'>
              <table className='w-full'>
                <thead className='bg-[#18B7CD] text-white'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Drug</th>
                    <th className='px-4 py-2 text-left'>Dosage</th>
                    <th className='px-4 py-2 text-left'>Duration</th>
                    <th className='px-4 py-2 text-left'>Dosage Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.prescriptions.map((prescription, index) => (
                    <tr key={index} className='border-b border-gray-200'>
                      <td className='px-4 py-2'>
                        <input
                          type='text'
                          className='w-full rounded border border-gray-300 p-1'
                          placeholder='Enter Drug Name'
                          value={prescription.drug}
                          onChange={e =>
                            updatePrescription(index, 'drug', e.target.value)
                          }
                        />
                      </td>
                      <td className='px-4 py-2'>
                        <input
                          type='text'
                          className='w-full rounded border border-gray-300 p-1'
                          placeholder='Enter Dosage amount'
                          value={prescription.dosage}
                          onChange={e =>
                            updatePrescription(index, 'dosage', e.target.value)
                          }
                        />
                      </td>
                      <td className='px-4 py-2'>
                        <input
                          type='text'
                          className='w-full rounded border border-gray-300 p-1'
                          placeholder='Enter Duration'
                          value={prescription.duration}
                          onChange={e =>
                            updatePrescription(
                              index,
                              'duration',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className='px-4 py-2'>
                        <input
                          type='text'
                          className='w-full rounded border border-gray-300 p-1'
                          placeholder='Enter Instructions'
                          value={prescription.method}
                          onChange={e =>
                            updatePrescription(index, 'method', e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add New Prescription Button */}
              <div className='flex justify-center border-t border-dashed border-[#18B7CD] bg-[#E4F9FC] py-2'>
                <button
                  className='flex items-center text-[#18B7CD] hover:text-[#149AAD]'
                  onClick={addPrescription}
                >
                  <span>Enter New Prescription</span>
                </button>
              </div>
              <div className='rounded-lg border border-[#18B7CD] p-4'>
                <textarea
                  name='additional_notes'
                  className='h-24 w-full rounded border border-gray-300 p-2'
                  placeholder='Enter Additional Notes (if any)'
                  value={formData.additional_notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                className='flex items-center rounded-md bg-[#18B7CD] px-4 py-2 text-white hover:bg-[#149AAD]'
                onClick={handleSubmit}
              >
                Confirm
                <ChevronLeft className='ml-1 h-5 w-5 rotate-180' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
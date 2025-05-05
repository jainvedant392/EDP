'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Edit, PlusCircle, Download } from 'lucide-react'
import Navbar from '@/components/Navbar'
import axios from 'axios'

export default function DoctorDiagnosisDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [diagnosisData, setDiagnosisData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [token, setToken] = useState('')
  const [doctorData, setDoctorData] = useState(null)
  const [editedVitals, setEditedVitals] = useState({
    bloodPressure: '',
    bloodSugar: '',
    spo2: '',
    heartRate: '',
  })

  // Get authentication token and doctor data from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      const storedDoctorData = localStorage.getItem('doctorData')

      if (storedToken) {
        setToken(storedToken)
      } else {
        // Redirect to login if no token is found
        // router.push('/login')
      }

      if (storedDoctorData) {
        try {
          setDoctorData(JSON.parse(storedDoctorData))
        } catch (err) {
          console.error('Error parsing doctor data from localStorage:', err)
        }
      }
    }
  }, [])

  // Format backend data to match frontend structure
  const formatDiagnosisData = backendData => {
    // Get diagnosis date and time in readable format
    const diagnosisDate = new Date(
      backendData.diagnosis_date + 'T' + backendData.diagnosis_time
    )
    const formattedDateTime = diagnosisDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    // Extract visiting doctor info if available
    const visitingDoctorName = backendData.visiting_doctor_id?.name
      ? `Dr. ${backendData.visiting_doctor_id.name}`
      : doctorData
        ? `Dr. ${doctorData.name}`
        : 'Unknown'

    const visitingDoctorSpecialization =
      backendData.visiting_doctor_id?.specializations?.[0] ||
      (doctorData ? doctorData.specializations?.[0] || 'N/A' : 'N/A')

    // Format and organize the diagnosis entries
    const diagnosisEntries = [
      {
        date: formattedDateTime,
        diagnosis: backendData.diagnosis_summary || '',
        summary: backendData.summary || '',
        testsTaken: backendData.tests || [],
        testResults:
          backendData.prescription?.tests?.map(test => ({
            file: test.test_file,
            results: test.test_results || '',
            comments: test.comments || ''
          })) || [],
        analysis: backendData.diagnosis_summary || '',
        status: backendData.status || 'ongoing',
        prescriptions:
          backendData.prescription?.medicines?.map(med => ({
            drug: med.medicine_name || med.drug,
            dosage: med.dosage,
            duration: med.duration,
            method: med.instructions || med.method
          })) || [],
        doctorsNotes:
          backendData.prescription?.additional_notes ||
          backendData.prescription?.notes ||
          ''
      }
    ]

    // Formatted data structure matching our frontend
    return {
      id: backendData.id,
      patientId: backendData.patient_id,
      patientName: backendData.patient_id?.name || '',
      age: backendData.patient_id?.age || '',
      gender: backendData.patient_id?.gender || '',
      bloodGroup: backendData.patient_id?.blood_group || '',
      doctorId: backendData.visiting_doctor_id || backendData.doctor_id,
      doctorName: visitingDoctorName,
      department: visitingDoctorSpecialization,
      dateTime: formattedDateTime,
      lastUpdated: formattedDateTime,
      vitals: {
        bloodPressure: backendData.blood_pressure || '',
        bloodSugar: backendData.blood_sugar || '',
        spo2: backendData.SPo2 ? backendData.SPo2.toString() : '',
        heartRate: backendData.heart_rate
          ? backendData.heart_rate.toString()
          : '',
      },
      diagnosisEntries: diagnosisEntries,
      // You might need to fetch these from a separate API endpoint
      pastMedicalHistory: backendData.patient_id?.medical_history || '',
      allergies: Array.isArray(backendData.patient_id?.allergies)
        ? backendData.patient_id?.allergies.join(', ')
        : backendData.patient_id?.allergies || '',
      familyHistory: backendData.patient_id?.family_medical_history || '',
      disabilities: Array.isArray(
        backendData.patient_id?.disabilities_or_diseases
      )
        ? backendData.patient_id?.disabilities_or_diseases.join(', ')
        : backendData.patient_id?.disabilities_or_diseases || ''
    }
  }

  // Fetch diagnosis data from backend API
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      if (!token) return

      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:8000/api/diagnosis-details/${params.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        console.log(response.data)
        const data = formatDiagnosisData(response.data)
        setDiagnosisData(data)
        setEditedVitals({
          bloodPressure: data.vitals.bloodPressure,
          bloodSugar: data.vitals.bloodSugar || '',
          spo2: data.vitals.spo2,
          heartRate: data.vitals.heartRate,
        })
      } catch (err) {
        console.error('Error fetching diagnosis data:', err)
        if (err.response?.status === 401) {
          // Unauthorized - token might be expired
          // localStorage.removeItem('token')
          // router.push('/login')
        } else {
          setError(
            err.response?.data?.error ||
              err.message ||
              'Failed to fetch diagnosis data'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id && token) {
      fetchDiagnosisData()
    }
  }, [params.id, token, router, doctorData]) // Added doctorData as dependency since it's used in formatDiagnosisData

  // Fetch additional patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!diagnosisData || !token) return

      try {
        const response = await axios.get(
          `http://localhost:8000/api/patients/${diagnosisData.patientId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        // Parse patient data from API response
        const patientData = {
          name: response.data.name || 'Unknown Patient',
          date_of_birth: response.data.dob || '',
          age: response.data.age || 0,
          gender: response.data.gender || '',
          blood_group: response.data.blood_group || '',
          medical_history: response.data.medical_history || '',
          allergies: Array.isArray(response.data.allergies)
            ? response.data.allergies.join(', ')
            : 'None',
          disabilities_or_diseases: Array.isArray(
            response.data.disabilities_or_diseases
          )
            ? response.data.disabilities_or_diseases.join(', ')
            : 'None',
          family_medical_history:
            response.data.family_medical_history || 'No family history recorded'
        }

        // Use a callback to ensure we're not creating circular dependencies
        setDiagnosisData(prev => {
          // Only update if we need to (prevents infinite loops)
          if (prev.patientName) return prev

          return {
            ...prev,
            patientName: patientData.name,
            age: patientData.age.toString(),
            gender: patientData.gender,
            bloodGroup: patientData.blood_group,
            pastMedicalHistory:
              patientData.medical_history || 'No medical history recorded',
            allergies: patientData.allergies || 'No allergies recorded',
            disabilities:
              patientData.disabilities_or_diseases || 'None recorded',
            familyHistory:
              patientData.family_medical_history || 'No family history recorded'
          }
        })
      } catch (err) {
        console.error('Error fetching patient data:', err)
        if (err.response?.status === 401) {
          // Unauthorized - token might be expired
          // localStorage.removeItem('token')
          // router.push('/login')
        }
      }
    }

    if (diagnosisData?.patientId && token && !diagnosisData.patientName) {
      fetchPatientData()
    }
  }, [diagnosisData?.patientId, token, router, diagnosisData?.patientName])

  const handleVitalsChange = (field, value) => {
    setEditedVitals(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveVitals = async () => {
    try {
      // Send updated vitals to API with token
      await axios.patch(
        `http://localhost:8000/api/update-diagnosis-vitals/${params.id}/`,
        {
          blood_pressure: editedVitals.bloodPressure,
          blood_sugar: editedVitals.bloodSugar,
          SPo2: parseInt(editedVitals.spo2, 10) || 0,
          heart_rate: parseInt(editedVitals.heartRate, 10) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Update local state
      setDiagnosisData(prev => ({
        ...prev,
        vitals: editedVitals,
        lastUpdated: new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }))
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating vitals:', err)
      if (err.response?.status === 401) {
        // Unauthorized - token might be expired
        // localStorage.removeItem('token')
        // router.push('/login')
      } else {
        alert(
          err.response?.data?.error ||
            'Failed to update vitals. Please try again.'
        )
      }
    }
  }

  const handleAddDiagnosis = () => {
    // Navigate to add diagnosis form
    router.push(`/doctorDashboard/addDiagnosis/${diagnosisData.patientId}`)
  }

  // Helper function to calculate age from date of birth
  const calculateAge = dateOfBirth => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  // Handle download test result
  const handleDownloadTest = fileName => {
    if (!token) {
      // alert('Authentication required. Please log in again.')
      // router.push('/login')
      return
    }

    // Create a URL with authorization token as query parameter
    // Note: In production, consider using more secure methods for file downloads
    const downloadUrl = `http://localhost:8000/api/download-test/${fileName}?token=${token}`
    window.open(downloadUrl, '_blank')
  }

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-lg'>Loading diagnosis data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <div className='mb-4 text-lg text-red-600'>Error: {error}</div>
        <Link
          href='/doctorDashboard'
          className='flex items-center text-gray-600 hover:text-gray-800'
        >
          <ChevronLeft className='mr-2 h-6 w-6' />
          <span>Back to Patient List</span>
        </Link>
      </div>
    )
  }

  if (!diagnosisData) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <div className='text-lg'>Diagnosis record not found</div>
        <Link
          href='/doctorDashboard'
          className='mt-4 flex items-center text-gray-600 hover:text-gray-800'
        >
          <ChevronLeft className='mr-2 h-6 w-6' />
          <span>Back to Patient List</span>
        </Link>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      {/* Patient Diagnosis Info */}
      <div className='p-6'>
        <div className='mb-6'>
          <Link
            href='/doctorDashboard'
            className='flex items-center text-gray-600 hover:text-gray-800'
          >
            <ChevronLeft className='mr-2 h-6 w-6' />
            <span>Back to Patient List</span>
          </Link>
        </div>

        {/* Patient Overview Card */}
        <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
          <div className='flex flex-wrap items-start justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>
                {diagnosisData.patientName || 'Patient Name'}
              </h1>
              <div className='mt-1 text-gray-600'>
                <span className='mr-4'>ID: {diagnosisData.patientId}</span>
                <span className='mr-4'>Age: {diagnosisData.age || 'N/A'}</span>
                <span className='mr-4'>
                  Gender: {diagnosisData.gender || 'N/A'}
                </span>
                <span>Blood Group: {diagnosisData.bloodGroup || 'N/A'}</span>
              </div>
              <div className='mt-2 text-sm text-gray-500'>
                Diagnosis Record: #{diagnosisData.id}
                <span className='ml-4'>
                  Status:
                  <span
                    className={`ml-1 rounded-full px-2 py-1 text-xs ${
                      diagnosisData.diagnosisEntries[0]?.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : diagnosisData.diagnosisEntries[0]?.status ===
                            'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {diagnosisData.diagnosisEntries[0]?.status
                      ?.charAt(0)
                      .toUpperCase() +
                      diagnosisData.diagnosisEntries[0]?.status?.slice(1) ||
                      'Ongoing'}
                  </span>
                </span>
              </div>
              <div className='mt-1 text-xs text-gray-400'>
                Last updated on {diagnosisData.lastUpdated}
              </div>
            </div>
            <button
              onClick={handleAddDiagnosis}
              className='mt-2 flex items-center rounded-md bg-[#18B7CD] px-4 py-2 text-white hover:bg-[#149AAD] sm:mt-0'
            >
              <PlusCircle className='mr-2 h-5 w-5' />
              <span>Add New Diagnosis</span>
            </button>
          </div>
        </div>

        {/* Patient History */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-[#18B7CD]'>
            Patient History
          </h2>
          <div className='grid gap-4 md:grid-cols-4'>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>
                Past Medical History
              </h3>
              <p className='text-sm text-gray-600'>
                {diagnosisData.pastMedicalHistory ||
                  'No medical history recorded'}
              </p>
            </div>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>Allergies</h3>
              <p className='text-sm text-gray-600'>
                {diagnosisData.allergies || 'No allergies recorded'}
              </p>
            </div>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>
                Disabilities/Diseases
              </h3>
              <p className='text-sm text-gray-600'>
                {diagnosisData.disabilities || 'None recorded'}
              </p>
            </div>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>Family History</h3>
              <p className='text-sm text-gray-600'>
                {diagnosisData.familyHistory || 'No family history recorded'}
              </p>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-[#18B7CD]'>
              Vital Signs
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className='flex items-center text-[#18B7CD] hover:text-[#149AAD]'
              >
                <Edit className='mr-1 h-4 w-4' />
                <span>Edit</span>
              </button>
            ) : (
              <div className='space-x-2'>
                <button
                  onClick={saveVitals}
                  className='rounded bg-[#18B7CD] px-3 py-1 text-sm text-white hover:bg-[#149AAD]'
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedVitals({
                      bloodPressure: diagnosisData.vitals.bloodPressure,
                      bloodSugar: diagnosisData.vitals.bloodSugar,
                      spo2: diagnosisData.vitals.spo2,
                      heartRate: diagnosisData.vitals.heartRate,
                    })
                  }}
                  className='rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-6'>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Blood Pressure</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={
                  isEditing
                    ? editedVitals.bloodPressure
                    : diagnosisData.vitals.bloodPressure
                }
                onChange={e =>
                  handleVitalsChange('bloodPressure', e.target.value)
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Blood Sugar</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={
                  isEditing
                    ? editedVitals.bloodSugar
                    : diagnosisData.vitals.bloodSugar
                }
                onChange={e => handleVitalsChange('bloodSugar', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>SPO2</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={
                  isEditing ? editedVitals.spo2 : diagnosisData.vitals.spo2
                }
                onChange={e => handleVitalsChange('spo2', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Heart Rate</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={
                  isEditing
                    ? editedVitals.heartRate
                    : diagnosisData.vitals.heartRate
                }
                onChange={e => handleVitalsChange('heartRate', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Diagnosis Entries */}
        <h2 className='mb-4 text-xl font-semibold text-[#18B7CD]'>
          Diagnosis History
        </h2>
        {diagnosisData.diagnosisEntries &&
          diagnosisData.diagnosisEntries.map((entry, index) => (
            <div
              key={index}
              className='mb-6 rounded-lg border border-gray-200 bg-white shadow-sm'
            >
              <div className='border-b border-gray-200 bg-gray-50 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='font-semibold text-[#18B7CD]'>
                    Diagnosis:{' '}
                    <span className='ml-2 rounded-full bg-[#18B7CD] px-3 py-1 text-sm text-white'>
                      {entry.diagnosis}
                    </span>
                  </div>
                  <div className='text-sm text-gray-500'>{entry.date}</div>
                </div>
              </div>

              <div className='p-4'>
                {entry.summary && (
                  <div className='mb-4'>
                    <div className='mb-2 font-semibold text-[#18B7CD]'>
                      Summary:
                    </div>
                    <div className='whitespace-pre-line rounded border border-gray-200 bg-gray-50 p-3 text-sm'>
                      {entry.summary}
                    </div>
                  </div>
                )}

                <div className='mb-4'>
                  <div className='mb-2 font-semibold text-[#18B7CD]'>
                    Tests Performed:
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {entry.testsTaken && entry.testsTaken.length > 0 ? (
                      entry.testsTaken.map((test, i) => (
                        <div
                          key={i}
                          className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'
                        >
                          {test}
                        </div>
                      ))
                    ) : (
                      <div className='text-sm text-gray-500'>
                        No tests performed
                      </div>
                    )}
                  </div>
                </div>

                <div className='mb-4'>
                  <div className='mb-2 font-semibold text-[#18B7CD]'>
                    Test Results:
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    {entry.testResults && entry.testResults.length > 0 ? (
                      entry.testResults.map((result, i) => (
                        <div
                          key={i}
                          className='flex items-center rounded bg-gray-100 px-3 py-2 text-sm'
                        >
                          <span className='text-blue-600'>{result.file}</span>
                          <Download
                            className='ml-2 h-4 w-4 cursor-pointer text-gray-600'
                            onClick={() => handleDownloadTest(result.file)}
                          />
                          {result.results && (
                            <div className='ml-2 text-xs text-gray-600'>
                              Results: {result.results}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className='text-sm text-gray-500'>
                        No test results available
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className='mb-4'>
                  <div className='mb-2 font-semibold text-[#18B7CD]'>
                    Analysis:
                  </div>
                  <div className='whitespace-pre-line rounded border border-gray-200 bg-gray-50 p-3 text-sm'>
                    {entry.analysis || 'No analysis available'}
                  </div>
                </div> */}

                {entry.prescriptions && entry.prescriptions.length > 0 && (
                  <div className='mb-4'>
                    <div className='mb-2 font-semibold text-[#18B7CD]'>
                      Prescription:
                    </div>
                    <div className='overflow-x-auto'>
                      <table className='w-full'>
                        <thead className='bg-[#18B7CD] text-white'>
                          <tr>
                            <th className='px-4 py-2 text-left'>Drug</th>
                            <th className='px-4 py-2 text-left'>Dosage</th>
                            <th className='px-4 py-2 text-left'>Duration</th>
                            <th className='px-4 py-2 text-left'>Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.prescriptions.map((med, i) => (
                            <tr key={i} className='border-b border-gray-200'>
                              <td className='px-4 py-3'>{med.drug}</td>
                              <td className='px-4 py-3'>{med.dosage}</td>
                              <td className='px-4 py-3'>{med.duration}</td>
                              <td className='px-4 py-3'>{med.method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {entry.doctorsNotes && (
                  <div className='mb-2'>
                    <div className='mb-2 font-semibold text-[#18B7CD]'>
                      Doctor's Notes:
                    </div>
                    <div className='rounded border border-gray-200 bg-gray-50 p-3 text-sm'>
                      {entry.doctorsNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

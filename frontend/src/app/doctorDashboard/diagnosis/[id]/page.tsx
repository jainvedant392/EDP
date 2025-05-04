'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Edit, PlusCircle, Download } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Mock data - replace with actual API fetch
const mockDiagnosisData = {
  'PRC-2025-0165': {
    id: 'PRC-2025-0165',
    patientName: 'Suresh Ramakrishnan',
    patientId: '0201006',
    age: '42',
    gender: 'Male',
    doctorName: 'Dr Arjun Sharma',
    department: 'ENT',
    dateTime: 'April 28, 2025, 05:36 PM',
    lastUpdated: 'April 28, 2025, 05:36 PM',
    vitals: {
      bloodPressure: '130',
      spo2: '98',
      heartRate: '76',
      temperature: '98.6',
      respiratoryRate: '16'
    },
    diagnosisEntries: [
      {
        date: 'April 28, 2025, 05:36 PM',
        diagnosis: 'Acute Asthma Episode',
        testsTaken: ['CBC Test', 'Influenza Test'],
        testResults: [
          'SureshRamakrishnan_cbctest98425.pdf',
          'SureshRamakrishnan_influenzatest60243.pdf'
        ],
        analysis:
          'CBC: Mildly elevated white blood cell count, indicating a viral infection.\nInfluenza Test: Positive for seasonal flu, no signs of bacterial co-infection.\nOverall Findings: Viral flu confirmed, no complications, symptomatic treatment recommended.',
        prescriptions: [
          {
            drug: 'Paracetamol',
            dosage: '650mg',
            duration: '5 days',
            method: 'Twice a day after food'
          },
          {
            drug: 'Salbutamol',
            dosage: '200mcg',
            duration: '7 days',
            method: '2 puffs six and when needed'
          },
          {
            drug: 'Budesonide',
            dosage: '500mcg',
            duration: '5 days',
            method: 'Twice daily after food'
          }
        ],
        doctorsNotes:
          'Patient is a known case of bronchial asthma who presented with shortness of breath, wheezing, and chest tightness. Vitals are stable with SpO₂ at 98% on room air. On auscultation, bilateral wheeze was noted with no signs of infection or respiratory distress. Patient was nebulized with salbutamol and ipratropium. Oral steroids prescribed for 5 days. Inhaler therapy to be continued. Patient was educated on trigger avoidance and proper inhaler technique.'
      },
      {
        date: 'April 24, 2025, 10:14 AM',
        diagnosis: 'Acute Asthma Episode',
        testsTaken: ['CBC Test'],
        testResults: ['SureshRamakrishnan_cbctest98245.pdf'],
        analysis:
          'CBC: Mildly elevated white blood cell count, indicating a viral infection.\nOverall Findings: Viral flu confirmed, no complications, symptomatic treatment recommended.',
        prescriptions: [
          {
            drug: 'Paracetamol',
            dosage: '650mg',
            duration: '5 days',
            method: 'Twice a day after food'
          },
          {
            drug: 'Salbutamol',
            dosage: '200mcg',
            duration: '7 days',
            method: '2 puffs six and when needed'
          }
        ],
        doctorsNotes:
          'Patient is a known case of bronchial asthma who presented with shortness of breath, wheezing, and chest tightness. Vitals are stable with SpO₂ at 98% on room air. On auscultation, bilateral wheeze was noted with no signs of infection or respiratory distress. Patient was nebulized with salbutamol and ipratropium. Oral steroids prescribed for 5 days. Inhaler therapy to be continued. Patient was educated on trigger avoidance and proper inhaler technique.'
      }
    ],
    pastMedicalHistory: 'Bronchial asthma since childhood. Seasonal allergic rhinitis.',
    allergies: 'Dust, Pollen, Aspirin',
    familyHistory: 'Father - Hypertension, Mother - Asthma'
  },
  'PRC-2025-0146': {
    id: 'PRC-2025-0146',
    patientName: 'Suresh Ramakrishnan',
    patientId: '0201006',
    age: '42',
    gender: 'Male',
    doctorName: 'Dr. Neha Reddy',
    department: 'Psychiatry',
    dateTime: 'March 24, 2025, 07:40 AM',
    lastUpdated: 'March 24, 2025, 09:15 AM',
    vitals: {
      bloodPressure: '124',
      spo2: '99',
      heartRate: '72',
      temperature: '98.4',
      respiratoryRate: '14'
    },
    diagnosisEntries: [
      {
        date: 'March 24, 2025, 07:40 AM',
        diagnosis: 'Anxiety disorders',
        testsTaken: ['Psychological Assessment'],
        testResults: ['SureshRamakrishnan_psychassessment38752.pdf'],
        analysis:
          'Psychological Assessment: Patient showing signs of generalized anxiety disorder with occasional panic attacks.\nOverall Findings: Moderate anxiety levels detected. Patient reports difficulty sleeping and occasional social withdrawal.',
        prescriptions: [
          {
            drug: 'Escitalopram',
            dosage: '10mg',
            duration: '30 days',
            method: 'Once daily before bed'
          }
        ],
        doctorsNotes:
          'Patient reported increased anxiety at work and home settings. Sleep patterns are disturbed with difficulty falling asleep. No suicidal ideation. Cognitive behavioral therapy recommended alongside medication. Follow-up in 2 weeks to assess medication response.'
      }
    ],
    pastMedicalHistory: 'Bronchial asthma since childhood. Seasonal allergic rhinitis.',
    allergies: 'Dust, Pollen, Aspirin',
    familyHistory: 'Father - Hypertension, Mother - Asthma'
  }
}

export default function DoctorDiagnosisDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [diagnosisData, setDiagnosisData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedVitals, setEditedVitals] = useState({})

  useEffect(() => {
    // In a real application, fetch data from API based on params.id
    // For now, using mock data
    if (params.id) {
      const data = mockDiagnosisData[params.id]
      if (data) {
        setDiagnosisData(data)
        setEditedVitals(data.vitals)
      }
      setLoading(false)
    }
  }, [params.id])

  const handleVitalsChange = (field, value) => {
    setEditedVitals(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveVitals = () => {
    // In a real app, this would send to API
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
  }

  const handleAddDiagnosis = () => {
    // Navigate to add diagnosis form
    router.push(`/doctorDashboard/addDiagnosis/${diagnosisData.patientId}`)
  }

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  if (!diagnosisData) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-lg'>Diagnosis record not found</div>
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
              <h1 className='text-2xl font-bold'>{diagnosisData.patientName}</h1>
              <div className='mt-1 text-gray-600'>
                <span className='mr-4'>ID: {diagnosisData.patientId}</span>
                <span className='mr-4'>Age: {diagnosisData.age}</span>
                <span>Gender: {diagnosisData.gender}</span>
              </div>
              <div className='mt-2 text-sm text-gray-500'>
                Diagnosis Record: #{diagnosisData.id}
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
          <h2 className='mb-4 text-xl font-semibold text-[#18B7CD]'>Patient History</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>Past Medical History</h3>
              <p className='text-sm text-gray-600'>{diagnosisData.pastMedicalHistory}</p>
            </div>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>Allergies</h3>
              <p className='text-sm text-gray-600'>{diagnosisData.allergies}</p>
            </div>
            <div>
              <h3 className='mb-2 font-medium text-gray-700'>Family History</h3>
              <p className='text-sm text-gray-600'>{diagnosisData.familyHistory}</p>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-[#18B7CD]'>Vital Signs</h2>
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
                    setEditedVitals(diagnosisData.vitals)
                  }}
                  className='rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Blood Pressure</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={isEditing ? editedVitals.bloodPressure : diagnosisData.vitals.bloodPressure}
                onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>SPO2</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={isEditing ? editedVitals.spo2 : diagnosisData.vitals.spo2}
                onChange={(e) => handleVitalsChange('spo2', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Heart Rate</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={isEditing ? editedVitals.heartRate : diagnosisData.vitals.heartRate}
                onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Temperature</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={isEditing ? editedVitals.temperature : diagnosisData.vitals.temperature}
                onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-gray-600'>Respiratory Rate</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={isEditing ? editedVitals.respiratoryRate : diagnosisData.vitals.respiratoryRate}
                onChange={(e) => handleVitalsChange('respiratoryRate', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Diagnosis Entries */}
        <h2 className='mb-4 text-xl font-semibold text-[#18B7CD]'>Diagnosis History</h2>
        {diagnosisData.diagnosisEntries.map((entry, index) => (
          <div key={index} className='mb-6 rounded-lg border border-gray-200 bg-white shadow-sm'>
            <div className='border-b border-gray-200 bg-gray-50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='font-semibold text-[#18B7CD]'>
                  Diagnosis: <span className='ml-2 rounded-full bg-[#18B7CD] px-3 py-1 text-sm text-white'>{entry.diagnosis}</span>
                </div>
                <div className='text-sm text-gray-500'>{entry.date}</div>
              </div>
            </div>
            
            <div className='p-4'>
              <div className='mb-4'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Tests Performed:
                </div>
                <div className='flex flex-wrap gap-2'>
                  {entry.testsTaken.map((test, i) => (
                    <div
                      key={i}
                      className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'
                    >
                      {test}
                    </div>
                  ))}
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Test Results:
                </div>
                <div className='flex flex-wrap gap-3'>
                  {entry.testResults.map((result, i) => (
                    <div
                      key={i}
                      className='flex items-center rounded bg-gray-100 px-3 py-2 text-sm'
                    >
                      <span className='text-blue-600'>{result}</span>
                      <Download className='ml-2 h-4 w-4 cursor-pointer text-gray-600' />
                    </div>
                  ))}
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Analysis:
                </div>
                <div className='whitespace-pre-line rounded border border-gray-200 bg-gray-50 p-3 text-sm'>
                  {entry.analysis}
                </div>
              </div>

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

              <div className='mb-2'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Doctor's Notes:
                </div>
                <div className='rounded border border-gray-200 bg-gray-50 p-3 text-sm'>
                  {entry.doctorsNotes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
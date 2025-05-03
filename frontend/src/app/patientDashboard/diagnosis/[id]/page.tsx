'use client'

// APIS REQUIRED IN THIS PAGE
// path('patients/<int:patient_id>/diagnoses/<int:diagnosis_id>/', get_diagnosis_for_patient, name='get_diagnosis_for_patient'),
// all prescriptions for a diagnosis
// all tests for a prescription

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Mock data - replace with actual API fetch
const mockDiagnosisData = {
  'PRC-2025-0165': {
    id: 'PRC-2025-0165',
    patientName: 'Suresh Ramakrishnan',
    patientId: '0201006',
    doctorName: 'Dr Arjun Sharma',
    department: 'ENT',
    dateTime: 'April 28, 2025, 05:36 PM',
    lastUpdated: 'April 28, 2025, 05:36 PM',
    vitals: {
      bloodPressure: '130',
      spo2: '98',
      heartRate: '76'
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
    ]
  },
  'PRC-2025-0146': {
    id: 'PRC-2025-0146',
    patientName: 'Suresh Ramakrishnan',
    patientId: '0201006',
    doctorName: 'Dr. Neha Reddy',
    department: 'Psychiatry',
    dateTime: 'March 24, 2025, 07:40 AM',
    lastUpdated: 'March 24, 2025, 09:15 AM',
    vitals: {
      bloodPressure: '124',
      spo2: '99',
      heartRate: '72'
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
    ]
  }
}

export default function DiagnosisDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [diagnosisData, setDiagnosisData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, fetch data from API based on params.id
    // For now, using mock data
    if (params.id) {
      const data = mockDiagnosisData[params.id]
      if (data) {
        setDiagnosisData(data)
      }
      setLoading(false)
    }
  }, [params.id])

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
            href='/patientDashboard'
            className='flex items-center text-gray-600 hover:text-gray-800'
          >
            <ChevronLeft className='mr-2 h-6 w-6' />
            <span>Patient Diagnosis</span>
          </Link>
        </div>

        <div className='mb-4'>
          <h1 className='text-2xl font-bold'>#{diagnosisData.id}</h1>
          <div className='text-sm text-gray-500'>
            Date and Time: {diagnosisData.dateTime}
          </div>
          <div className='text-sm text-[#18B7CD]'>
            Patient Name: {diagnosisData.patientName}
          </div>
          <div className='text-sm text-[#18B7CD]'>
            Doctor Name: {diagnosisData.doctorName}
          </div>
          <div className='text-sm text-[#18B7CD]'>
            Department: {diagnosisData.department}
          </div>
          <div className='mt-1 text-xs text-gray-400'>
            Last updated on {diagnosisData.lastUpdated}
          </div>
        </div>

        {/* Vital Signs */}
        <div className='mb-6 rounded-lg bg-[#E4F9FC] p-4'>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <div className='mb-1 text-sm text-[#18B7CD]'>Blood Pressure</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={diagnosisData.vitals.bloodPressure}
                readOnly
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-[#18B7CD]'>SPO2</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={diagnosisData.vitals.spo2}
                readOnly
              />
            </div>
            <div>
              <div className='mb-1 text-sm text-[#18B7CD]'>Heart Rate</div>
              <input
                type='text'
                className='w-full rounded border border-gray-300 p-2'
                value={diagnosisData.vitals.heartRate}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Diagnosis Entries */}
        {diagnosisData.diagnosisEntries.map((entry, index) => (
          <div key={index} className='mb-6 rounded-lg border border-[#18B7CD]'>
            <div className='rounded-lg bg-white p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='font-semibold text-[#18B7CD]'>Diagnosis:</div>
                <div className='text-xs text-gray-500'>{entry.date}</div>
              </div>

              <div className='mb-4'>
                <div className='mb-2 inline-block rounded-full bg-[#18B7CD] px-3 py-1 text-white'>
                  {entry.diagnosis}
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Tests Taken:
                </div>
                <div className='flex flex-wrap gap-2'>
                  {entry.testsTaken.map((test, i) => (
                    <div
                      key={i}
                      className='rounded-full bg-[#18B7CD] px-3 py-1 text-sm text-white'
                    >
                      {test}
                    </div>
                  ))}
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Results:
                </div>
                <div>
                  {entry.testResults.map((result, i) => (
                    <div
                      key={i}
                      className='mb-1 cursor-pointer text-blue-500 underline'
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2 font-semibold text-[#18B7CD]'>
                  Analysis:
                </div>
                <div className='whitespace-pre-line text-sm'>
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
                <div className='text-sm'>{entry.doctorsNotes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

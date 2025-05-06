'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@radix-ui/react-select'
import Navbar from '@/components/Navbar'
import axios from 'axios'

export default function DoctorDashboard() {
  const router = useRouter()
  const [diagnoses, setDiagnoses] = useState([])
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([])
  const [sortOrder, setSortOrder] = useState('Latest')
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [dateRange, setDateRange] = useState('All Time')
  const [diagnosisTypes, setDiagnosisTypes] = useState(['All'])
  const [patientIds, setPatientIds] = useState(['All'])
  const [selectedPatientId, setSelectedPatientId] = useState('All')
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [patients, setPatients] = useState({}) // New state to store patient data

  // Status options with capitalized first letter
  const statusOptions = ['All', 'Ongoing', 'Completed', 'Cancelled']

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctorData')
    if (storedDoctor) {
      const doctorData = JSON.parse(storedDoctor)
      setDoctor(doctorData)

      // Fetch diagnoses for the doctor
      fetchDiagnoses(doctorData.id)
    }
  }, [])

  // New function to fetch patient data
  const fetchPatientDetails = async (patientId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `http://localhost:8000/api/patients/${patientId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (err) {
      console.error(`Error fetching patient ${patientId} details:`, err)
      return null
    }
  }

  const fetchDiagnoses = async doctorId => {
    try {
      setLoading(true)
      setError(null) // Clear any previous errors
      const token = localStorage.getItem('token')

      const response = await axios.get(
        `http://localhost:8000/api/doctors/${doctorId}/diagnoses/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const diagnosesData = response.data

      // If diagnosesData is empty, set empty arrays but don't show an error
      if (!diagnosesData || diagnosesData.length === 0) {
        setDiagnoses([])
        setFilteredDiagnoses([])
        setDiagnosisTypes(['All'])
        setPatientIds(['All'])
        setLoading(false)
        return
      }

      // Extract unique patient IDs to fetch their details
      const uniquePatientIds = [...new Set(diagnosesData.map(d => 
        typeof d.patient_id === 'object' ? d.patient_id.id : d.patient_id
      ))]
      
      // Create a map of patient IDs to their full details
      const patientMap = {}
      
      // Fetch patient details for each unique patient ID
      await Promise.all(uniquePatientIds.map(async (patientId) => {
        const patientData = await fetchPatientDetails(patientId)
        if (patientData) {
          patientMap[patientId] = patientData
        }
      }))
      
      // Store patient data in state
      setPatients(patientMap)

      // Format diagnoses data
      const formattedDiagnoses = diagnosesData.map(diagnosis => {
        // Get patient ID properly regardless of format
        const patientId = typeof diagnosis.patient_id === 'object' 
          ? diagnosis.patient_id.id 
          : diagnosis.patient_id
          
        // Get patient name from our fetched patient data, fallback to ID if not found
        const patientName = patientMap[patientId]?.name || `Patient ${patientId}`

        // Format date and time
        const date = new Date(diagnosis.diagnosis_date)
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })

        // Format time
        let hours = parseInt(diagnosis.diagnosis_time.split(':')[0])
        const minutes = diagnosis.diagnosis_time.split(':')[1]
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12 // Convert 0 to 12
        const formattedTime = `${hours}:${minutes} ${ampm}`

        // Create a unique diagnosis summary for the filter
        const diagnosisSummary =
          diagnosis.diagnosis_summary.length > 30
            ? diagnosis.diagnosis_summary.substring(0, 30).split(' ')[0] // Get the first word or part
            : diagnosis.diagnosis_summary

        return {
          date: formattedDate,
          time: formattedTime,
          patientName: patientName,
          patientId: patientId,
          diagnosis: diagnosisSummary,
          status:
            diagnosis.status.charAt(0).toUpperCase() +
            diagnosis.status.slice(1), // Capitalize the status
          recordId: diagnosis.id,
          rawDate: new Date(diagnosis.diagnosis_date).getTime(), // Store as timestamp for accurate sorting
          rawDateTime: new Date(
            `${diagnosis.diagnosis_date}T${diagnosis.diagnosis_time}`
          ).getTime(), // Combine date and time for more precise sorting
          fullDiagnosis: diagnosis.diagnosis_summary
        }
      })

      setDiagnoses(formattedDiagnoses)
      setFilteredDiagnoses(formattedDiagnoses)

      // Extract unique diagnosis types for filter
      const uniqueDiagnoses = [
        'All',
        ...new Set(formattedDiagnoses.map(d => d.diagnosis))
      ]
      setDiagnosisTypes(uniqueDiagnoses)

      // Extract unique patient IDs for filter
      const filterPatientIds = [
        'All',
        ...uniquePatientIds
      ]
      setPatientIds(filterPatientIds)

      setLoading(false)
    } catch (err) {
      console.error('Error fetching diagnoses:', err)
      setError('Failed to fetch diagnoses data. Please try again later.')
      setLoading(false)
    }
  }

  const handleRowClick = recordId => {
    router.push(`/doctorDashboard/diagnosis/${recordId}`)
  }

  // Using useEffect to handle filtering and sorting when dependencies change
  useEffect(() => {
    if (diagnoses.length === 0) return

    let filtered = [...diagnoses]

    if (selectedDiagnosis !== 'All') {
      filtered = filtered.filter(
        record => record.diagnosis === selectedDiagnosis
      )
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(record => record.status === selectedStatus)
    }

    // Filter by patient ID
    if (selectedPatientId !== 'All') {
      filtered = filtered.filter(
        record => record.patientId.toString() === selectedPatientId.toString()
      )
    }

    // Filter by date range
    if (dateRange === 'This Month') {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      filtered = filtered.filter(record => {
        return record.rawDate >= firstDay.getTime()
      })
    } else if (dateRange === 'This Week') {
      const today = new Date()
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
      filtered = filtered.filter(record => {
        return record.rawDate >= firstDay.getTime()
      })
    }

    // Sort the records by date and time
    filtered.sort((a, b) => {
      // Use rawDateTime for more precise sorting (includes both date and time)
      if (sortOrder === 'Latest') {
        return b.rawDateTime - a.rawDateTime // Descending (newest first)
      } else {
        return a.rawDateTime - b.rawDateTime // Ascending (oldest first)
      }
    })

    setFilteredDiagnoses(filtered)
  }, [
    diagnoses,
    selectedDiagnosis,
    selectedStatus,
    selectedPatientId,
    sortOrder,
    dateRange
  ])

  const handleDiagnosisChange = value => {
    setSelectedDiagnosis(value)
  }

  const handleStatusChange = value => {
    setSelectedStatus(value)
  }

  const handlePatientIdChange = value => {
    setSelectedPatientId(value)
  }

  const handleDateRangeChange = value => {
    setDateRange(value)
  }

  const handleAllRecords = () => {
    setSortOrder('Latest')
    setSelectedDiagnosis('All')
    setSelectedStatus('All')
    setSelectedPatientId('All')
    setDateRange('All Time')
  }

  // Format patient ID display for the dropdown
  const formatPatientIdDisplay = (id) => {
    if (id === 'All') return 'All'
    return patients[id]?.name ? `${patients[id].name} (ID: ${id})` : `ID: ${id}`
  }

  // Stats calculation
  const totalPatients = new Set(diagnoses.map(record => record.patientId)).size
  const ongoingCases = diagnoses.filter(
    record => record.status === 'Ongoing'
  ).length
  const completedCases = diagnoses.filter(
    record => record.status === 'Completed'
  ).length

  if (loading) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Navbar />
        <div className='flex flex-1 items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-[#18B7CD] border-t-[#18B7CD]'></div>
            <p className='text-lg text-gray-600'>Loading diagnosis data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Navbar />
        <div className='flex flex-1 items-center justify-center'>
          <div className='rounded-lg bg-red-50 p-6 text-center'>
            <p className='mb-2 text-lg text-red-600'>Error: {error}</p>
            <button
              onClick={() => doctor && fetchDiagnoses(doctor.id)}
              className='rounded-md bg-[#18B7CD] px-4 py-2 text-white hover:bg-[#0da2b8]'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      {/* Main Content */}

      {/* Doctor Info Section */}
      <section className='flex items-center p-6'>
        <button className='mr-4' onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>

        <div className='relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#18B7CD]'>
          <Image
            src={doctor?.profile_picture || '/defaultDoctor.png'}
            alt={doctor?.name || 'Doctor'}
            width={128}
            height={128}
            className='object-cover'
          />
        </div>

        <div className='ml-6'>
          <p className='text-lg text-gray-600'>Welcome</p>
          <h1 className='text-3xl font-bold'>
            {doctor?.name || 'Doctor Name'}
          </h1>
          <p className='text-[#18B7CD]'>
            {doctor?.medical_license_number || '---'} |{' '}
            {doctor?.specializations?.join(', ') || '---'} |{' '}
            {doctor?.qualifications?.join(', ') || '---'}
          </p>
        </div>

        {/* Stats cards */}
        <div className='ml-auto flex gap-4'>
          <div className='rounded-lg bg-blue-50 p-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>
              Total Patients
            </h3>
            <p className='text-2xl font-bold text-blue-600'>{totalPatients}</p>
          </div>
          <div className='rounded-lg bg-green-50 p-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>Completed</h3>
            <p className='text-2xl font-bold text-green-600'>
              {completedCases}
            </p>
          </div>
          <div className='rounded-lg bg-amber-50 p-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>Ongoing</h3>
            <p className='text-2xl font-bold text-amber-600'>{ongoingCases}</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className='mb-4 flex flex-wrap gap-2 px-6'>
        <button
          onClick={handleAllRecords}
          className='rounded-full bg-[#18B7CD] px-4 py-1 text-sm text-white'
        >
          All Records
        </button>

        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className='flex h-8 w-32 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue placeholder='Sort' className='text-sm font-medium'>
                {sortOrder}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              <SelectItem
                value='Latest'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                Latest
              </SelectItem>
              <SelectItem
                value='Oldest'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                Oldest
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue
                placeholder='Date Range'
                className='text-sm font-medium'
              >
                {dateRange}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              <SelectItem
                value='All Time'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                All Time
              </SelectItem>
              <SelectItem
                value='This Month'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                This Month
              </SelectItem>
              <SelectItem
                value='This Week'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                This Week
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select
            value={selectedDiagnosis}
            onValueChange={handleDiagnosisChange}
          >
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue
                placeholder='Diagnosis'
                className='text-sm font-medium'
              >
                {selectedDiagnosis === 'All' ? 'Diagnosis' : selectedDiagnosis}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              {diagnosisTypes.map(diagnosis => (
                <SelectItem
                  key={diagnosis}
                  value={diagnosis}
                  className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
                >
                  {diagnosis}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue placeholder='Status' className='text-sm font-medium'>
                {selectedStatus === 'All' ? 'Status' : selectedStatus}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              {statusOptions.map(status => (
                <SelectItem
                  key={status}
                  value={status}
                  className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Updated Patient Filter with Names */}
        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select
            value={selectedPatientId}
            onValueChange={handlePatientIdChange}
          >
            <SelectTrigger className='flex h-8 w-56 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue
                placeholder='Patient'
                className='text-sm font-medium'
              >
                {selectedPatientId === 'All' ? 'Patient' : formatPatientIdDisplay(selectedPatientId)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              {patientIds.map(id => (
                <SelectItem
                  key={id}
                  value={id}
                  className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
                >
                  {formatPatientIdDisplay(id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Table Section */}
      <section className='relative flex-1 px-6 pb-6'>
        <div className='h-96 rounded-lg shadow'>
          <div className='h-full overflow-x-auto overflow-y-auto rounded-lg'>
            {diagnoses.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center rounded-lg bg-white'>
                <div className='p-6 text-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mx-auto mb-4 h-16 w-16 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                  <h3 className='mb-2 text-lg font-medium text-gray-900'>
                    No Diagnosis Records
                  </h3>
                  <p className='mb-4 text-gray-500'>
                    You haven't created any diagnosis records yet.
                  </p>
                  <button
                    onClick={() =>
                      router.push('/doctorDashboard/new-diagnosis')
                    }
                    className='inline-flex items-center rounded-md bg-[#18B7CD] px-4 py-2 text-white hover:bg-[#0da2b8]'
                  >
                    + Create New Diagnosis
                  </button>
                </div>
              </div>
            ) : filteredDiagnoses.length > 0 ? (
              <table className='w-full'>
                <thead className='sticky top-0 z-10 bg-[#18B7CD] text-white'>
                  <tr>
                    <th className='p-3 text-left'>Date</th>
                    <th className='p-3 text-left'>Time</th>
                    <th className='p-3 text-left'>Patient Name</th>
                    <th className='p-3 text-left'>Patient ID</th>
                    <th className='p-3 text-left'>Diagnosis</th>
                    <th className='p-3 text-left'>Status</th>
                    <th className='p-3 text-left'>Record ID</th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {filteredDiagnoses.map(record => (
                    <tr
                      key={record.recordId}
                      className='cursor-pointer border-b hover:bg-gray-50'
                      onClick={() => handleRowClick(record.recordId)}
                    >
                      <td className='p-3'>{record.date}</td>
                      <td className='p-3'>{record.time}</td>
                      <td className='p-3'>{record.patientName}</td>
                      <td className='p-3'>{record.patientId}</td>
                      <td className='p-3' title={record.fullDiagnosis}>
                        {record.diagnosis}
                      </td>
                      <td className='p-3'>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            record.status === 'Ongoing'
                              ? 'bg-amber-100 text-amber-800'
                              : record.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className='p-3'>{record.recordId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex h-full items-center justify-center rounded-lg bg-white text-gray-500'>
                <p>No diagnosis records found with the selected filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Diagnosis button positioned in the bottom left corner */}
        <div className='absolute bottom-32 right-8'>
          <button
            onClick={() => {
              if (selectedPatientId !== 'All') {
                router.push(
                  `/doctorDashboard/addDiagnosis/${selectedPatientId}/`
                )
              }
            }}
            disabled={selectedPatientId === 'All'}
            className={`flex items-center gap-1 rounded-md px-4 py-2 text-white shadow-lg ${
              selectedPatientId !== 'All'
                ? 'cursor-pointer bg-green-500 hover:bg-green-600'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
            title={
              selectedPatientId === 'All'
                ? 'Select a patient first'
                : 'Add diagnosis for this patient'
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Add Diagnosis
          </button>
        </div>
      </section>
    </div>
  )
}
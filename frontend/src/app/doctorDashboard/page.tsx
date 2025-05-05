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
  const [patientIds, setPatientIds] = useState(['All']) // Added patient IDs state
  const [selectedPatientId, setSelectedPatientId] = useState('All') // Added selected patient ID state
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const fetchDiagnoses = async (doctorId) => {
    try {
      setLoading(true)
      setError(null) // Clear any previous errors
      const token = localStorage.getItem('token')
      
      const response = await axios.get(`http://localhost:8000/api/doctors/${doctorId}/diagnoses/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const diagnosesData = response.data
      
      // If diagnosesData is empty, set empty arrays but don't show an error
      if (!diagnosesData || diagnosesData.length === 0) {
        setDiagnoses([])
        setFilteredDiagnoses([])
        setDiagnosisTypes(['All'])
        setPatientIds(['All']) // Initialize patient IDs with "All" option
        setLoading(false)
        return
      }
      
      // Format diagnoses data
      const formattedDiagnoses = diagnosesData.map(diagnosis => {
        // Extract patient name from the patient object if it exists, otherwise use ID
        const patientName = diagnosis.patient_id?.name || `Patient ${diagnosis.patient_id}`
        
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
        const diagnosisSummary = diagnosis.diagnosis_summary.length > 30
          ? diagnosis.diagnosis_summary.substring(0, 30).split(' ')[0] // Get the first word or part
          : diagnosis.diagnosis_summary
        
        return {
          date: formattedDate,
          time: formattedTime,
          patientName: patientName,
          patientId: typeof diagnosis.patient_id === 'object' ? diagnosis.patient_id.id : diagnosis.patient_id,
          diagnosis: diagnosisSummary,
          status: diagnosis.status.charAt(0).toUpperCase() + diagnosis.status.slice(1), // Capitalize the status
          recordId: diagnosis.id,
          rawDate: diagnosis.diagnosis_date, // Keep raw date for sorting
          fullDiagnosis: diagnosis.diagnosis_summary
        }
      })
      
      setDiagnoses(formattedDiagnoses)
      setFilteredDiagnoses(formattedDiagnoses)
      
      // Extract unique diagnosis types for filter
      const uniqueDiagnoses = ['All', ...new Set(formattedDiagnoses.map(d => d.diagnosis))]
      setDiagnosisTypes(uniqueDiagnoses)
      
      // Extract unique patient IDs for filter
      const uniquePatientIds = ['All', ...new Set(formattedDiagnoses.map(d => d.patientId))]
      setPatientIds(uniquePatientIds)
      
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

  // Date parsing function
  const parseDate = dateStr => {
    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    }

    // Split the date string properly
    const parts = dateStr.split(' ')
    const month = parts[0]
    const day = parseInt(parts[1].replace(',', ''))
    const year = parseInt(parts[2])

    return new Date(year, monthMap[month], day)
  }

  // Using useEffect to handle filtering and sorting when dependencies change
  useEffect(() => {
    if (diagnoses.length === 0) return
    
    let filtered = [...diagnoses]

    if (selectedDiagnosis !== 'All') {
      filtered = filtered.filter(record => record.diagnosis === selectedDiagnosis)
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(record => record.status === selectedStatus)
    }

    // Filter by patient ID
    if (selectedPatientId !== 'All') {
      filtered = filtered.filter(record => record.patientId.toString() === selectedPatientId.toString())
    }

    // Filter by date range
    if (dateRange === 'This Month') {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      filtered = filtered.filter(record => {
        // Use rawDate for more accurate filtering
        const recordDate = new Date(record.rawDate)
        return recordDate >= firstDay
      })
    } else if (dateRange === 'This Week') {
      const today = new Date()
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.rawDate)
        return recordDate >= firstDay
      })
    }

    // Sort the records by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.rawDate)
      const dateB = new Date(b.rawDate)

      if (sortOrder === 'Latest') {
        return dateB - dateA // Descending (newest first)
      } else {
        return dateA - dateB // Ascending (oldest first)
      }
    })

    setFilteredDiagnoses(filtered)
  }, [diagnoses, selectedDiagnosis, selectedStatus, selectedPatientId, sortOrder, dateRange])

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

  // Stats calculation
  const totalPatients = new Set(diagnoses.map(record => record.patientId)).size
  const ongoingCases = diagnoses.filter(record => record.status === 'Ongoing').length
  const completedCases = diagnoses.filter(record => record.status === 'Completed').length

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 border-4 border-t-[#18B7CD] border-r-[#18B7CD] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600">Loading diagnosis data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-lg text-red-600 mb-2">Error: {error}</p>
            <button 
              onClick={() => doctor && fetchDiagnoses(doctor.id)} 
              className="px-4 py-2 bg-[#18B7CD] text-white rounded-md hover:bg-[#0da2b8]"
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
            {doctor?.specializations?.join(', ') || '---'} | {doctor?.qualifications?.join(', ') || '---'}
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
      <section className='mb-4 flex gap-2 px-6 flex-wrap'>
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

        {/* New Patient ID Filter */}
        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select value={selectedPatientId} onValueChange={handlePatientIdChange}>
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue placeholder='Patient ID' className='text-sm font-medium'>
                {selectedPatientId === 'All' ? 'Patient ID' : selectedPatientId}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              {patientIds.map(id => (
                <SelectItem
                  key={id}
                  value={id}
                  className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
                >
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button 
          className='ml-auto flex items-center gap-1 rounded-full bg-[#18B7CD] px-4 py-1 text-sm text-white'
          onClick={() => router.push('/doctorDashboard/schedule')} // Assuming you have a schedule route
        >
          <Calendar size={16} />
          Schedule
        </button>
      </section>

      {/* Table Section */}
      <section className='flex-1 px-6 pb-6 relative'>
        <div className='h-96 rounded-lg shadow'>
          <div className='h-full overflow-x-auto overflow-y-auto rounded-lg'>
            {diagnoses.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center bg-white rounded-lg">
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Diagnosis Records</h3>
                  <p className="text-gray-500 mb-4">You haven't created any diagnosis records yet.</p>
                  <button 
                    onClick={() => router.push('/doctorDashboard/new-diagnosis')} 
                    className="inline-flex items-center px-4 py-2 bg-[#18B7CD] text-white rounded-md hover:bg-[#0da2b8]"
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
              <div className="flex h-full items-center justify-center bg-white text-gray-500 rounded-lg">
                <p>No diagnosis records found with the selected filters.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Add Diagnosis button positioned in the bottom left corner */}
        <div className="absolute bottom-32 right-8">
          <button
            onClick={() => {
              if (selectedPatientId !== 'All') {
                router.push(`/doctorDashboard/new-diagnosis?patientId=${selectedPatientId}`)
              }
            }}
            disabled={selectedPatientId === 'All'}
            className={`flex items-center gap-1 px-4 py-2 rounded-md shadow-lg text-white ${
              selectedPatientId !== 'All' 
                ? 'bg-green-500 hover:bg-green-600 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={selectedPatientId === 'All' ? 'Select a patient first' : 'Add diagnosis for this patient'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Diagnosis
          </button>
        </div>
      </section>
    </div>
  )
}
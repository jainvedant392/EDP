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

// Mock data for the doctor
const doctorData = {
  name: 'Dr. Arjun Sharma',
  id: 'DOC-2023-142',
  department: 'ENT',
  qualification: 'MD, MBBS',
  profileImage: '' // You'll need to add this image to your public folder
}

// Mock data for diagnoses records
const diagnosesRecords = [
  {
    date: 'May 2, 2025',
    time: '10:15 am',
    patientName: 'Suresh Ramakrishnan',
    patientId: '0201006',
    diagnosis: 'Asthma',
    status: 'Ongoing',
    recordId: 'DGN-2025-0189'
  },
  {
    date: 'April 28, 2025',
    time: '05:36 pm',
    patientName: 'Suresh Ramakrishnan',
    patientId: '0201006',
    diagnosis: 'Asthma',
    status: 'Completed',
    recordId: 'DGN-2025-0165'
  },
  {
    date: 'April 25, 2025',
    time: '01:20 pm',
    patientName: 'Priya Malhotra',
    patientId: '0201054',
    diagnosis: 'Allergic Rhinitis',
    status: 'Completed',
    recordId: 'DGN-2025-0152'
  },
  {
    date: 'April 20, 2025',
    time: '09:45 am',
    patientName: 'Raj Patel',
    patientId: '0201032',
    diagnosis: 'Sinusitis',
    status: 'Completed',
    recordId: 'DGN-2025-0134'
  },
  {
    date: 'April 15, 2025',
    time: '03:30 pm',
    patientName: 'Anita Desai',
    patientId: '0201089',
    diagnosis: 'Tonsillitis',
    status: 'Completed',
    recordId: 'DGN-2025-0121'
  },
  {
    date: 'April 10, 2025',
    time: '11:00 am',
    patientName: 'Vikram Singh',
    patientId: '0201045',
    diagnosis: 'Ear Infection',
    status: 'Ongoing',
    recordId: 'DGN-2025-0110'
  },
  {
    date: 'April 5, 2025',
    time: '02:15 pm',
    patientName: 'Meera Kapoor',
    patientId: '0201067',
    diagnosis: 'Throat Infection',
    status: 'Completed',
    recordId: 'DGN-2025-0098'
  },
  {
    date: 'March 28, 2025',
    time: '04:45 pm',
    patientName: 'Aryan Joshi',
    patientId: '0201023',
    diagnosis: 'Vertigo',
    status: 'Ongoing',
    recordId: 'DGN-2025-0087'
  },
  {
    date: 'March 20, 2025',
    time: '10:30 am',
    patientName: 'Kavita Sharma',
    patientId: '0201078',
    diagnosis: 'Deviated Nasal Septum',
    status: 'Completed',
    recordId: 'DGN-2025-0076'
  }
]

// Filter options
const diagnosisTypes = ['All', 'Asthma', 'Allergic Rhinitis', 'Sinusitis', 'Tonsillitis', 'Ear Infection', 'Throat Infection', 'Vertigo', 'Deviated Nasal Septum']
const statusOptions = ['All', 'Ongoing', 'Completed']

export default function DoctorDashboard() {
  const router = useRouter()
  const [filteredRecords, setFilteredRecords] = useState(diagnosesRecords)
  const [sortOrder, setSortOrder] = useState('Latest')
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [dateRange, setDateRange] = useState('All Time')

  const handleRowClick = (recordId) => {
    router.push(`/doctorDashboard/diagnosis/${recordId}`)
  }

  // Date parsing function
  const parseDate = (dateStr) => {
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11
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
    let filtered = [...diagnosesRecords]

    if (selectedDiagnosis !== 'All') {
      filtered = filtered.filter(record => record.diagnosis === selectedDiagnosis)
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(record => record.status === selectedStatus)
    }

    // Filter by date range (simplified for mock data)
    if (dateRange === 'This Month') {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      filtered = filtered.filter(record => {
        const recordDate = parseDate(record.date)
        return recordDate >= firstDay
      })
    } else if (dateRange === 'This Week') {
      const today = new Date()
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
      filtered = filtered.filter(record => {
        const recordDate = parseDate(record.date)
        return recordDate >= firstDay
      })
    }

    // Sort the records by date
    filtered.sort((a, b) => {
      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)

      if (sortOrder === 'Latest') {
        return dateB.getTime() - dateA.getTime() // Descending (newest first)
      } else {
        return dateA.getTime() - dateB.getTime() // Ascending (oldest first)
      }
    })

    setFilteredRecords(filtered)
  }, [selectedDiagnosis, selectedStatus, sortOrder, dateRange])

  const handleDiagnosisChange = value => {
    setSelectedDiagnosis(value)
  }

  const handleStatusChange = value => {
    setSelectedStatus(value)
  }

  const handleDateRangeChange = value => {
    setDateRange(value)
  }

  const handleAllRecords = () => {
    setSortOrder('Latest')
    setSelectedDiagnosis('All')
    setSelectedStatus('All')
    setDateRange('All Time')
  }

  // Stats calculation
  const totalPatients = new Set(diagnosesRecords.map(record => record.patientId)).size
  const ongoingCases = diagnosesRecords.filter(record => record.status === 'Ongoing').length
  const completedCases = diagnosesRecords.filter(record => record.status === 'Completed').length

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      {/* Main Content */}

      {/* Doctor Info Section */}
      <section className='flex items-center p-6'>
        <button className='mr-4'>
          <ChevronLeft size={24} />
        </button>

        <div className='relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#18B7CD]'>
          <Image
            src=''
            alt={doctorData.name}
            width={128}
            height={128}
            className='object-cover'
          />
        </div>

        <div className='ml-6'>
          <p className='text-lg text-gray-600'>Welcome</p>
          <h1 className='text-3xl font-bold'>{doctorData.name}</h1>
          <p className='text-[#18B7CD]'>#{doctorData.id} | {doctorData.department} | {doctorData.qualification}</p>
        </div>

        {/* Stats cards */}
        <div className='ml-auto flex gap-4'>
          <div className='rounded-lg bg-blue-50 p-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>Total Patients</h3>
            <p className='text-2xl font-bold text-blue-600'>{totalPatients}</p>
          </div>
          <div className='rounded-lg bg-green-50 p-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>Completed</h3>
            <p className='text-2xl font-bold text-green-600'>{completedCases}</p>
          </div>
          <div className='rounded-lg bg-amber-50 p-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>Ongoing</h3>
            <p className='text-2xl font-bold text-amber-600'>{ongoingCases}</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className='mb-4 flex gap-2 px-6'>
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
              <SelectValue placeholder='Date Range' className='text-sm font-medium'>
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
          <Select value={selectedDiagnosis} onValueChange={handleDiagnosisChange}>
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue placeholder='Diagnosis' className='text-sm font-medium'>
                {selectedDiagnosis === 'All' ? 'Diagnosis' : selectedDiagnosis}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
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
              <SelectValue
                placeholder='Status'
                className='text-sm font-medium'
              >
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
        
        <button className='ml-auto flex items-center gap-1 rounded-full bg-[#18B7CD] px-4 py-1 text-sm text-white'>
          <Calendar size={16} />
          Schedule
        </button>
      </section>

      {/* Table Section */}
      <section className='flex-1 px-6 pb-6'>
        <div className='h-96 rounded-lg shadow'>
          <div className='h-full overflow-x-auto overflow-y-auto rounded-lg'>
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
                {filteredRecords.map(record => (
                  <tr
                    key={record.recordId}
                    className='cursor-pointer border-b hover:bg-gray-50'
                    onClick={() => handleRowClick(record.recordId)}
                  >
                    <td className='p-3'>{record.date}</td>
                    <td className='p-3'>{record.time}</td>
                    <td className='p-3'>{record.patientName}</td>
                    <td className='p-3'>{record.patientId}</td>
                    <td className='p-3'>{record.diagnosis}</td>
                    <td className='p-3'>
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        record.status === 'Ongoing' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className='p-3'>{record.recordId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
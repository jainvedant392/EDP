'use client'

// APIS REQUIRED IN THIS PAGE
// path('patients/<int:patient_id>/diagnoses/', get_diagnoses_for_patient, name='get_diagnoses_for_patient')

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@radix-ui/react-select'
import Navbar from '@/components/Navbar'

// Mock data
const patientData = {
  name: 'Suresh Ramakrishnan',
  id: '0201006',
  profileImage: '' // You'll need to add this image to your public folder
}

const medicalRecords = [
  {
    date: 'April 28, 2025',
    time: '05:36 pm',
    department: 'ENT',
    doctor: 'Dr. Arjun Sharma',
    diagnosis: 'Asthma',
    recordId: 'PRC-2025-0165'
  },
  {
    date: 'March 24, 2025',
    time: '07:40 am',
    department: 'Psychiatry',
    doctor: 'Dr. Neha Reddy',
    diagnosis: 'Anxiety disorders',
    recordId: 'PRC-2025-0146'
  },
  {
    date: 'March 6, 2025',
    time: '06:42 am',
    department: 'Psychiatry',
    doctor: 'Dr. Rahul Mehra',
    diagnosis: 'Bipolar disorder',
    recordId: 'PRC-2025-0123'
  },
  {
    date: 'February 28, 2025',
    time: '01:55 pm',
    department: 'Psychiatry',
    doctor: 'Dr. Rahul Mehra',
    diagnosis: 'Bipolar disorder',
    recordId: 'PRC-2025-0065'
  },
  {
    date: 'January 2, 2025',
    time: '04:15 am',
    department: 'Psychiatry',
    doctor: 'Dr. Neha Reddy',
    diagnosis: 'ADHD',
    recordId: 'PRC-2025-0034'
  },
  {
    date: 'December 11, 2024',
    time: '10:32 pm',
    department: 'Physician',
    doctor: 'Dr. Aarti Singh',
    diagnosis: 'Viral Fever',
    recordId: 'PRC-2024-6573'
  },
  {
    date: 'October 19, 2024',
    time: '11:31 pm',
    department: 'ENT',
    doctor: 'Dr. Arjun Sharma',
    diagnosis: 'Throat Infection',
    recordId: 'PRC-2024-6532'
  },
  {
    date: 'October 7, 2024',
    time: '10:12 am',
    department: 'ENT',
    doctor: 'Dr. Arjun Sharma',
    diagnosis: 'Throat Infection',
    recordId: 'PRC-2024-6342'
  },
  {
    date: 'September 11, 2024',
    time: '07:11 pm',
    department: 'Physician',
    doctor: 'Dr. Aarti Singh',
    diagnosis: 'Viral Fever',
    recordId: 'PRC-2024-6253'
  }
]

const departments = ['All', 'ENT', 'Psychiatry', 'Physician']
const doctors = [
  'All',
  'Dr. Arjun Sharma',
  'Dr. Neha Reddy',
  'Dr. Rahul Mehra',
  'Dr. Aarti Singh'
]

export default function PatientDashboard() {
  const router = useRouter()
  const [filteredRecords, setFilteredRecords] = useState(medicalRecords)
  const [sortOrder, setSortOrder] = useState('Latest')
  const [selectedDoctor, setSelectedDoctor] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')

  const handleRowClick = (recordId) => {
    router.push(`/patientDashboard/diagnosis/${recordId}`)
  }

  // Fixed date parsing function
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
    let filtered = [...medicalRecords]

    if (selectedDoctor !== 'All') {
      filtered = filtered.filter(record => record.doctor === selectedDoctor)
    }

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(
        record => record.department === selectedDepartment
      )
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
  }, [selectedDoctor, selectedDepartment, sortOrder])

  const handleDoctorChange = value => {
    setSelectedDoctor(value)
  }

  const handleDepartmentChange = value => {
    setSelectedDepartment(value)
  }

  const handleAllRecords = () => {
    setSortOrder('Latest')
    setSelectedDoctor('All')
    setSelectedDepartment('All')
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      {/* Main Content */}

      {/* Patient Info Section */}
      <section className='flex items-center p-6'>
        <button className='mr-4'>
          <ChevronLeft size={24} />
        </button>

        <div className='relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#18B7CD]'>
          <Image
            src=''
            alt={patientData.name}
            width={128}
            height={128}
            className='object-cover'
          />
        </div>

        <div className='ml-6'>
          <p className='text-lg text-gray-600'>Welcome</p>
          <h1 className='text-4xl font-bold'>{patientData.name}</h1>
          <p className='text-[#18B7CD]'>#{patientData.id}</p>
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
          <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue placeholder='Doctor' className='text-sm font-medium'>
                {selectedDoctor === 'All' ? 'Doctor' : selectedDoctor}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              {doctors.map(doctor => (
                <SelectItem
                  key={doctor}
                  value={doctor}
                  className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
                >
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
          <Select>
            <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
              <SelectValue
                placeholder='Status'
                className='text-sm font-medium'
              ></SelectValue>
            </SelectTrigger>
            <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
              <SelectItem
                value='ongoing'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                Ongoing
              </SelectItem>
              <SelectItem
                value='completed'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                Completed
              </SelectItem>
              <SelectItem
                value='cancelled'
                className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
              >
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  <th className='p-3 text-left'>Department</th>
                  <th className='p-3 text-left'>Doctor</th>
                  <th className='p-3 text-left'>Diagnosis</th>
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
                    <td className='p-3'>{record.department}</td>
                    <td className='p-3'>{record.doctor}</td>
                    <td className='p-3'>{record.diagnosis}</td>
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

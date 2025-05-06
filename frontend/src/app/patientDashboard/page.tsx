'use client'

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
import axios from 'axios'

// Mock patient data - This would also come from API eventually
const patientData = {
  name: 'Vedant Jain',
  id: '1',
  profileImage: '/defaultDoctor.png' // You'll need to add this image to your public folder
}

// Constants for departments and doctors (can be moved to API later)
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
  const [diagnosisRecords, setDiagnosisRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOrder, setSortOrder] = useState('Latest')
  const [selectedDoctor, setSelectedDoctor] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')

  const patientId = patientData.id // In a real app, get this from route params or context

  // Fetch diagnosis data from API
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        setLoading(true)
        // Get auth token from local storage or context
        const token = localStorage.getItem('token') // Adjust based on how you store tokens
        
        const response = await axios.get(
          `http://localhost:8000/api/patients/1/diagnoses/`, 
          {
            headers: {
              Authorization: `Bearer ${token}` // Adjust based on your auth method
            }
          }
        )
        
        setDiagnosisRecords(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching diagnosis data:', err)
        setError('Failed to load diagnosis records')
      } finally {
        setLoading(false)
      }
    }

    fetchDiagnosisData()
  }, [patientId])

  const handleRowClick = (diagnosisId) => {
    router.push(`/patientDashboard/diagnosis/${diagnosisId}`)
  }

  // Format the date from API format to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  // Format the time from API format to display format
  const formatTime = (timeString) => {
    // API returns time in format like "14:30:00"
    const [hours, minutes] = timeString.split(':')
    const time = new Date()
    time.setHours(parseInt(hours, 10))
    time.setMinutes(parseInt(minutes, 10))
    
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase()
  }

  // We'll leave filter logic for future implementation
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

      {/* Patient Info Section */}
      <section className='flex items-center p-6'>
        <button className='mr-4'>
          <ChevronLeft size={24} />
        </button>

        <div className='relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#18B7CD]'>
          <Image
            src={patientData.profileImage}
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

      {/* Filters Section - Keeping as is for now */}
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
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading diagnosis records...</p>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className='h-full overflow-x-auto overflow-y-auto rounded-lg'>
              <table className='w-full'>
                <thead className='sticky top-0 z-10 bg-[#18B7CD] text-white'>
                  <tr>
                    <th className='p-3 text-left'>Date</th>
                    <th className='p-3 text-left'>Time</th>
                    <th className='p-3 text-left'>Status</th>
                    <th className='p-3 text-left'>Diagnosis</th>
                    <th className='p-3 text-left'>Diagnosis ID</th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {diagnosisRecords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No diagnosis records found
                      </td>
                    </tr>
                  ) : (
                    diagnosisRecords.map(record => (
                      <tr
                        key={record.id}
                        className='cursor-pointer border-b hover:bg-gray-50'
                        onClick={() => handleRowClick(record.id)}
                      >
                        <td className='p-3'>{formatDate(record.diagnosis_date)}</td>
                        <td className='p-3'>{formatTime(record.diagnosis_time)}</td>
                        <td className='p-3'>
                          <span className={`px-2 py-1 rounded text-xs font-medium
                            ${record.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${record.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            ${record.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className='p-3'>
                          {record.diagnosis_summary.length > 50 
                            ? `${record.diagnosis_summary.substring(0, 50)}...` 
                            : record.diagnosis_summary}
                        </td>
                        <td className='p-3'>#{record.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
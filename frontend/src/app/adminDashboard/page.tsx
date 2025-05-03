// app/admin/dashboard/page.jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Search } from 'lucide-react'
import { Button } from '@radix-ui/themes'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from '@radix-ui/react-select'
import Navbar from '@/components/Navbar'

export default function AdminDashboard() {
  const [patients, setPatients] = useState([
    {
      date: 'April 28, 2025',
      name: 'Devon Lane',
      gender: 'Male',
      age: '32y',
      aadhar: '214598706321',
      status: 'Admitted'
    },
    {
      date: 'April 28, 2025',
      name: 'Theresa Webb',
      gender: 'Female',
      age: '24y',
      aadhar: '512048376921',
      status: 'Admitted'
    },
    {
      date: 'April 28, 2025',
      name: 'Jacob Jones',
      gender: 'Male',
      age: '58y',
      aadhar: '830214697532',
      status: 'Discharged'
    },
    {
      date: 'April 28, 2025',
      name: 'Ralph Edwards',
      gender: 'Male',
      age: '14y',
      aadhar: '950732186124',
      status: 'Discharged'
    },
    {
      date: 'April 28, 2025',
      name: 'Robert Fox',
      gender: 'Male',
      age: '73y',
      aadhar: '236154870921',
      status: 'Admitted'
    },
    {
      date: 'April 28, 2025',
      name: 'Dianne Russell',
      gender: 'Female',
      age: '44y',
      aadhar: '479062531248',
      status: 'Discharged'
    },
    {
      date: 'April 28, 2025',
      name: 'Esther Howard',
      gender: 'Female',
      age: '46y',
      aadhar: '104762389251',
      status: 'Admitted'
    },
    {
      date: 'April 28, 2025',
      name: 'Floyd Miles',
      gender: 'Male',
      age: '25y',
      aadhar: '472893561024',
      status: 'Discharged'
    },
    {
      date: 'April 27, 2025',
      name: 'Courtney Henry',
      gender: 'Female',
      age: '20y',
      aadhar: '813690725412',
      status: 'Discharged'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.aadhar.includes(searchTerm)
    const matchesDate = dateFilter ? patient.date === dateFilter : true
    const matchesStatus = statusFilter ? patient.status === statusFilter : true

    return matchesSearch && matchesDate && matchesStatus
  })

  return (
    <div className='min-h-screen bg-white'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className='p-6'>
        <div className='mb-4 flex items-center'>
          <ChevronLeft className='mr-2' />
          <h2 className='text-sm text-gray-500'>
            Welcome Admin <span className='text-[#18B7CD]'>#100106</span>
          </h2>
        </div>

        <h1 className='mb-6 text-4xl font-bold'>Mr. Rajesh Khumbla</h1>

        {/* Search and Filter */}
        <div className='mb-6 flex justify-between'>
          <div className='relative max-w-lg flex-1'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search Patient Name / Aadhar'
              className='w-full rounded-full border py-2 pl-10 pr-4'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href='/adminDashboard/create-allotment'>
            <Button className='flex items-center rounded-md bg-[#18B7CD] px-4 py-2 text-white'>
              <Plus className='mr-2 h-4 w-4' /> Create Allotment
            </Button>
          </Link>
        </div>

        {/* Filter Pills */}
        <section className='mb-4 flex gap-2 px-6'>
          <button
            // onClick={handleAllRecords}
            className='rounded-full bg-[#18B7CD] px-4 py-1 text-sm text-white'
          >
            All Records
          </button>

          <div className='rounded-full border border-[#18B7CD] shadow-sm hover:border-[#0da2b8]'>
            <Select>
              <SelectTrigger className='flex h-8 w-32 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
                <SelectValue placeholder='Sort' className='text-sm font-medium'>
                  {/* {sortOrder} */}
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
            <Select>
              <SelectTrigger className='flex h-8 w-40 cursor-pointer items-center justify-between rounded-full border-none bg-white px-3 text-black'>
                <SelectValue
                  placeholder='Doctor'
                  className='text-sm font-medium'
                >
                  {/* {selectedDoctor === 'All' ? 'Doctor' : selectedDoctor} */}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className='z-50 mt-1 rounded-md border border-[#18B7CD] bg-white px-3 shadow-md'>
                {/* {doctors.map(doctor => (
                  <SelectItem
                    key={doctor}
                    value={doctor}
                    className='cursor-pointer py-2 hover:bg-[#e8f7fa]'
                  >
                    {doctor}
                  </SelectItem>
                ))} */}
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

        {/* Patient Table */}
        <section className='flex-1 px-6 pb-6'>
          <div className='h-96 rounded-lg shadow'>
            <div className='h-full overflow-x-auto overflow-y-auto rounded-lg'>
              <table className='w-full'>
                <thead className='sticky top-0 z-10 bg-[#18B7CD] text-white'>
                  <tr>
                    <th className='px-4 py-3 text-left'>Date</th>
                    <th className='px-4 py-3 text-left'>Name</th>
                    <th className='px-4 py-3 text-left'>Gender</th>
                    <th className='px-4 py-3 text-left'>Age</th>
                    <th className='px-4 py-3 text-left'>Aadhar</th>
                    <th className='px-4 py-3 text-left'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={index}
                      className='cursor-pointer border-b hover:bg-gray-50'
                    >
                      <td className='px-4 py-3'>{patient.date}</td>
                      <td className='px-4 py-3'>{patient.name}</td>
                      <td className='px-4 py-3'>{patient.gender}</td>
                      <td className='px-4 py-3'>{patient.age}</td>
                      <td className='px-4 py-3'>{patient.aadhar}</td>
                      <td className='px-4 py-3'>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            patient.status === 'Admitted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

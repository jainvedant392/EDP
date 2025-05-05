'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

export default function PatientRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    password: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    // In a real app, you would handle registration here
    console.log('Patient registration data:', formData)
    // Redirect to patient login on successful registration
  }

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className='relative flex flex-grow items-center justify-center'>
        {/* Background Image with Blur */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='/login_register_medbot.png'
            alt='Background'
            layout='fill'
            objectFit='cover'
            quality={100}
            className='blur-sm brightness-50 filter'
            priority
          />
        </div>

        {/* Content */}
        <div className='z-10 mx-4 w-full max-w-xl md:mx-auto'>
          <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
            <div className='p-6'>
              <div className='mb-6 flex items-center'>
                <Link href='/login/patient' className='text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </Link>
                <div className='flex w-full items-center justify-between'>
                  <h2 className='ml-4 text-lg font-medium'>
                    Enter Required Details
                  </h2>
                  <span className='text-sm text-gray-500'>Patient Entry</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className='space-y-4'>
                  <input
                    type='text'
                    name='name'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Enter Name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type='text'
                    name='aadhaar'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Enter Aadhaar Number'
                    value={formData.aadhaar}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type='password'
                    name='password'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Enter password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type='submit'
                  className='mt-6 w-full rounded-full bg-cyan-500 py-3 text-white transition duration-200 hover:bg-cyan-600'
                >
                  Register Patient
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function PatientLoginPage() {
  const [aadhaar, setAadhaar] = useState('')  
  const [password, setPassword] = useState('')  

  const router = useRouter()

  const handleSubmit = e => {
    e.preventDefault()
    // In a real app, you would handle authentication here
    console.log('Patient login with ID:', aadhaar, password)
    // Redirect to patient dashboard on successful login
  }

  return (
    <div className='flex min-h-screen flex-col bg-gray-800'>
      {/* Main Content */}
      <main className='flex flex-grow'>
        {/* Left Side - Doctor Image */}
        <div className='relative hidden w-1/2 bg-cover bg-center md:block'>
          <Image
            src='/login_register_medbot.png'
            alt='Medical Professional'
            layout='fill'
            objectFit='cover'
            priority
          />
        </div>

        {/* Right Side - Login Form */}
        <div className='flex w-full items-center justify-center bg-gray-800 p-6 md:w-1/2'>
          <div className='w-full max-w-md'>
            <div className='mb-6 flex justify-center'>
              <div className='flex items-center text-white'>
                <Image
                  src='/Union.png'
                  alt='MedBot Logo'
                  width={30}
                  height={30}
                  className='mr-2'
                />
                <span className='text-2xl font-semibold'>MedBot</span>
              </div>
            </div>

            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <div className='mb-6 flex items-center'>
                <button onClick={() => router.push('/')} className='text-gray-500'>
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
                </button>
                <h2 className='flex-grow text-center text-lg font-medium'>
                  Welcome Patient
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                  <input
                    type='text'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Enter Aadhaar'
                    value={aadhaar}
                    onChange={e => setAadhaar(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <input
                    type='text'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Enter password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type='submit'
                  className='w-full rounded-full bg-cyan-500 py-3 text-white transition duration-200 hover:bg-cyan-600'
                >
                  Continue
                </button>
              </form>

              <div className='mt-4 flex justify-between text-sm'>
                <Link
                  href='/register/patient'
                  className='text-cyan-500 hover:underline'
                >
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

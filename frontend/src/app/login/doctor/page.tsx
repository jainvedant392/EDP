'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'

export default function DoctorLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function fetchDoctorDetails(token, id) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/doctors/${id}/`,
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    };
    
    async function makeRequest() {
      try {
        const response = await axios.request(config);
        localStorage.setItem('doctorData', JSON.stringify(response.data))
      }
      catch (error) {
        console.log(error);
      }
    }
    
    makeRequest();
  }

  async function LoginDoctor() {
    const data = new URLSearchParams()
    data.append('email', email)
    data.append('password', password)

    try {
      const result = await axios.post(
        'http://localhost:8000/login/doctor/',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const token = result.data.access
      const doctor_id = result.data.id

      localStorage.setItem('token', token)
      localStorage.setItem('doctor_id', doctor_id)

      await fetchDoctorDetails(token, doctor_id)
      router.push('/doctorDashboard/')
    } catch {
      window.alert('Invalid credentials')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await LoginDoctor()
  }

  return (
    <div className='relative min-h-screen bg-gray-800'>
      {/* Background image for screens < 2xl */}
      <div className='absolute inset-0 z-0 block 2xl:hidden'>
        <Image
          src='/login_register_medbot.png'
          alt='Medical Professional'
          layout='fill'
          objectFit='cover'
          priority
        />
      </div>

      {/* 2xl and above - split layout */}
      <main className='relative z-10 flex min-h-screen flex-col 2xl:flex-row'>
        {/* Left Side - shown only in ≥2xl */}
        <div className='relative hidden w-1/2 bg-cover bg-center 2xl:block'>
          <Image
            src='/login_register_medbot.png'
            alt='Medical Professional'
            layout='fill'
            objectFit='cover'
            priority
          />
        </div>

        {/* Right Side - Login Form */}
        <div className='flex w-full min-h-screen items-center justify-center bg-gray-800 bg-opacity-80 p-6 2xl:w-1/2'>
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
                <button onClick={() => router.back()} className='text-gray-500'>
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
                  Welcome Doctor
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                  <input
                    type='text'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Enter Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <input
                    type='password'
                    className='w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    placeholder='Password'
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

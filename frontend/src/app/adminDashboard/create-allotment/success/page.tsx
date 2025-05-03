// app/admin/success/page.jsx
'use client'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@radix-ui/themes'
import Navbar from '@/components/Navbar'

export default function AllotmentSuccess() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        className='flex flex-col items-center justify-center p-6'
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className='flex w-full max-w-md flex-col items-center text-center'>
          <div className='mb-6 rounded-lg p-6'>
            <div className='mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#18B7CD]'>
              <Check className='h-16 w-16 text-white' />
            </div>
          </div>

          <p className='mb-8 text-2xl font-semibold'>
            Patient Room & Bed Allotted Successfully
          </p>

          <Link href='/adminDashboard'>
            <Button className='rounded-md bg-[#18B7CD] px-8 py-2 text-white'>
              Go to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

// app/admin/create-allotment/page.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { Button, Progress } from '@radix-ui/themes'
import Navbar from '@/components/Navbar'

export default function CreateAllotment() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    contactNo: '',
    aadharNumber: '',
    gender: '',
    dob: ''
  })
  const [allocationDetails, setAllocationDetails] = useState({
    ward: '',
    floor: '',
    roomNo: '',
    bedNo: ''
  })

  const handlePatientDetailsChange = e => {
    const { name, value } = e.target
    setPatientDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleAllocationDetailsChange = e => {
    const { name, value } = e.target
    setAllocationDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleRoomSelection = roomNumber => {
    setAllocationDetails(prev => ({ ...prev, roomNo: roomNumber }))
  }

  const nextStep = () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Submit the form and redirect
      handleSubmitAllotment()
    }
  }

  const prevStep = () => {
    if (step === 2) {
      setStep(1)
    } else {
      router.push('/admin/dashboard')
    }
  }

  const handleSubmitAllotment = async () => {
    // Here you would normally make an API call to save the data
    // For now, we'll just simulate success and redirect
    console.log('Submitting:', { patientDetails, allocationDetails })

    // Redirect to the success page
    router.push('/adminDashboard/create-allotment/success')
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Navbar */}
      <Navbar />

      {/* Progress Bar */}
      <div className='p-6'>
        <div className='flex items-center'>
          <button onClick={prevStep} className='mr-2'>
            <ChevronLeft />
          </button>
          <Progress
            value={step === 1 ? 0 : 50}
            className='h-1 w-1/2 bg-gray-200'
          />
        </div>
      </div>

      {/* Main Content */}
      <main className='p-6'>
        {step === 1 ? (
          // Step 1: Patient Details
          <div>
            <h1 className='mb-6 text-2xl font-semibold'>
              Enter Patient Details
            </h1>

            <div className='max-w-3xl space-y-4'>
              <div>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter Patient Name'
                  value={patientDetails.name}
                  onChange={handlePatientDetailsChange}
                  className='w-full rounded-md border p-3'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <input
                  type='text'
                  name='contactNo'
                  placeholder='Enter Contact No'
                  value={patientDetails.contactNo}
                  onChange={handlePatientDetailsChange}
                  className='rounded-md border p-3'
                />
                <input
                  type='text'
                  name='aadharNumber'
                  placeholder='Enter Aadhar Number'
                  value={patientDetails.aadharNumber}
                  onChange={handlePatientDetailsChange}
                  className='rounded-md border p-3'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <input
                  type='text'
                  name='gender'
                  placeholder='Enter Gender'
                  value={patientDetails.gender}
                  onChange={handlePatientDetailsChange}
                  className='rounded-md border p-3'
                />
                <input
                  type='text'
                  name='dob'
                  placeholder='Enter DOB (DD-MM-YYYY)'
                  value={patientDetails.dob}
                  onChange={handlePatientDetailsChange}
                  className='rounded-md border p-3'
                />
              </div>

              <div className='mt-8 flex justify-end'>
                <Button
                  onClick={nextStep}
                  className='flex items-center rounded-md bg-[#18B7CD] px-6 py-2 text-white'
                >
                  Continue <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Allocation Details
          <div>
            <h1 className='mb-6 text-2xl font-semibold'>
              Enter Patient Allocation Details
            </h1>

            <div className='max-w-3xl space-y-4'>
              <div>
                <input
                  type='text'
                  name='ward'
                  placeholder='Enter Ward'
                  value={allocationDetails.ward}
                  onChange={handleAllocationDetailsChange}
                  className='w-full rounded-md border p-3'
                />
              </div>

              <div>
                <input
                  type='text'
                  name='floor'
                  placeholder='Enter Floor No'
                  value={allocationDetails.floor}
                  onChange={handleAllocationDetailsChange}
                  className='w-full rounded-md border p-3'
                />
              </div>

              <div>
                <input
                  type='text'
                  name='roomNo'
                  placeholder='Enter Room No'
                  value={allocationDetails.roomNo}
                  onChange={handleAllocationDetailsChange}
                  className='w-full rounded-md border p-3'
                />
              </div>

              {/* Room Selection Pills */}
              <div className='flex flex-wrap gap-2 rounded-md bg-blue-50 p-4'>
                {[101, 102, 103, 104, 105, 106, 107].map(room => (
                  <button
                    key={room}
                    onClick={() => handleRoomSelection(room.toString())}
                    className={`rounded-full px-4 py-2 ${
                      allocationDetails.roomNo === room.toString()
                        ? 'bg-[#18B7CD] text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type='text'
                  name='bedNo'
                  placeholder='Enter Bed No'
                  value={allocationDetails.bedNo}
                  onChange={handleAllocationDetailsChange}
                  className='w-full rounded-md border p-3'
                />
              </div>

              <div className='mt-8 flex justify-between'>
                <Button
                  onClick={prevStep}
                  variant='soft'
                  className='flex items-center rounded-md px-6 py-2 text-[#18B7CD]'
                >
                  <ChevronLeft className='mr-2 h-4 w-4' /> Back
                </Button>
                <Button
                  onClick={nextStep}
                  className='flex items-center rounded-md bg-[#18B7CD] px-6 py-2 text-white'
                >
                  Confirm <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

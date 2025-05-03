import Image from 'next/image'

export default function Navbar() {
  return (
    <div>
      <header className='flex items-center justify-between bg-[#18B7CD] p-4 text-white'>
        <div className='flex items-center'>
          <div className='mr-2'>
            <Image
              src='/Union.png'
              alt='MedBot Logo'
              width={30}
              height={30}
              className='mr-2'
            />
          </div>
          <span className='text-2xl font-bold'>MedBot</span>
        </div>
      </header>
    </div>
  )
}

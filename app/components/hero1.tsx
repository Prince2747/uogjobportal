import React from 'react'
import Image from 'next/image'
import gdg from '@/public/gondarun.jpg'
import SearchBar from './search'
function Homehero(){
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div className="lg:pt-4 lg:pr-8">
          <div className="lg:max-w-lg">
            <h2 className="text-base/7 font-semibold text-indigo-600">University of Gondar Job Portal</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              Apply for  Jobs at one of The oldest Universities in Ethiopia
            </p>
           <SearchBar/>
           
          </div>
        </div>
        <Image
          alt="Gondar Graduation"
          src={gdg}
          width={2432}
          height={1442}
          className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
        />
      </div>
    </div>
  </div>
  )
}

export default Homehero
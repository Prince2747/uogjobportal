'use client';
import search from '@/public/search.png'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center justify-center p-5">
      <div className="rounded-lg bg-gray-200 p-5">
        <div className="flex">
          <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
          
          </div>
          <input
            type="text"
            className="w-full max-w-[160px] bg-white pl-2 text-base font-semibold outline-0"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:bg-blue-800 transition-colors"
          >
           <Image src={search} alt='search icon' width={30} height={30}/>
          </button>
        </div>
      </div>
    </div>
  );
}

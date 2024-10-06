import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

interface Props {
    term?: string;
}

export const Search = ({ term = '' }:Props) => {
  const [searchTerm, setSearchTerm] = useState(term);
  const [ isActive, setIsActive ] = useState(false);
  const { push } = useRouter();

  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return;
    push(`/search/${ searchTerm }`);
  }
  return (
    <div className='absolute top-16 right-5 my-4'>
      {
        isActive ? (
          <>
            <div className='relative'>
              <input 
                  type="text"
                  autoFocus
                  className='rounded-full py-2 pl-3 pr-12 lg:w-72 text-dark summary-card'
                  placeholder='Buscar producto'
                  value={ searchTerm }
                  onChange={ (e) => setSearchTerm( e.target.value ) }
                  onKeyUp={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                  
              />
              <button onClick={() => setIsActive(!isActive)}>
                <MagnifyingGlassIcon className='mr-2 w-8 absolute top-1 right-0' />
              </button>
            </div>
          </>
        ) : (
          <div className='relative'>
            <button onClick={() => setIsActive(!isActive)}>
              <MagnifyingGlassIcon className='mr-2 w-8 absolute top-1 right-0 text-white' />
            </button>
          </div>
        )
      }
    </div>
  )
}

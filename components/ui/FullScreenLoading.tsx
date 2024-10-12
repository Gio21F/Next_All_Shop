import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const FullScreenLoading = () => {
  return (
    <div className='w-full pt-32 flex h-full justify-center text-black dark:text-white'>
        <FontAwesomeIcon icon={faSpinner} className="fa-3x mx-2 animate-spin" />
    </div>
  )
}
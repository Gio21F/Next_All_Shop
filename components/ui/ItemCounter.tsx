import { FC } from 'react';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';


interface Props {
  currentValue: number;
  maxValue: number;

  // Methods
  updatedQuantity: (newValue: number) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, updatedQuantity, maxValue }) => {

  const addOrRemove = ( value: number ) => {
    if ( value === -1 ) {
      if ( currentValue === 1 ) return;

      return updatedQuantity( currentValue - 1);
    }

    if ( currentValue >= maxValue ) return;

    updatedQuantity( currentValue + 1 );
  }
  

  return (
    <div className='flex my-2'>
        <button className='w-6' onClick={ () => addOrRemove(-1) }>
            <MinusCircleIcon className='text-black dark:text-white' />
        </button>
        <p className='w-16 flex justify-center text-black dark:text-white'> {currentValue} </p>
        <button className='w-6' onClick={ () => addOrRemove(+1) }>
            <PlusCircleIcon className='text-black dark:text-white' />
        </button>
    </div>
  )
}
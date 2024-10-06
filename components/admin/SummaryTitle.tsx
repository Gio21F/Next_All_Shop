import { FC } from 'react';
interface Props {
    title: string;
    subTitle: string | number;
    icon: JSX.Element
}


export const SummaryTile:FC<Props> = ({ title, subTitle, icon }) => {
  return (
    <div className='flex gap-4 justify-center p-4 dark:shadow-white/15 shadow-md rounded-lg dark:text-white text-black'>
        { icon }
        <div className='flex flex-col ml-2'>
            <h3 className='text-sm'>{ title }</h3>
            <h4 className='text-sm'>{ subTitle }</h4>
        </div>
    </div>
  )
}
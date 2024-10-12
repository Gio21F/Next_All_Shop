import { FC, ReactNode, useContext } from 'react';
import { Nav } from '../ui/Nav';
import { UiContext } from '@/context';
interface Props {
    title: string;
    subTitle: string;
    icon?: JSX.Element;
    children: ReactNode;
    autoHeight?: boolean;
}

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const AdminLayout:FC<Props> = ({ children, title, subTitle, icon, autoHeight = false }) => {
    const { theme } = useContext(UiContext);   
    return (
    <main className={`${theme} max-w-[1700px] min-w-[320px] ${autoHeight ? 'h-auto' : 'h-screen'} bg-zinc-200 dark:bg-zinc-950`}>
        <nav>
            <Nav />
        </nav>
        <div className='max-w-[1700px] px-2 md:px-10 py-3 text-black dark:text-white'>
            <div className='flex flex-col my-4'>
                <h1 className='text-3xl font-semibold flex'>
                    { icon }
                    {' '} { title }
                </h1>
                <h2 className='text-xl'>{ subTitle }</h2>
            </div>

            <div className='fadeIn h-auto'>
                { children }
            </div>
        </div>

    </main>
  )
}

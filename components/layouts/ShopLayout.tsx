import { FC, ReactNode, useContext } from 'react';
import Head from 'next/head';
import { Nav } from '../ui/Nav';
import { Search } from '../products/Search';
import { UiContext } from '@/context';


interface Props {
    title: string;
    children: ReactNode;
    pageDescription: string;
    imageFullUrl?: string;
    autoHeight?: boolean;
}

export const ShopLayout:FC<Props> = ({ children, title, pageDescription, imageFullUrl, autoHeight = false }) => {
  const { theme } = useContext(UiContext); 
  return (
    <>
        <Head>
            <title>{ title }</title>
            <meta name="description" content={ pageDescription } />
            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />
            {
                imageFullUrl && (
                    <meta name="og:image" content={ imageFullUrl } />
                )
            }
        </Head> 
        
        <main className={`${ theme } max-w-[1700px] ${autoHeight ? 'h-auto' : 'h-screen'} min-w-[320px] bg-zinc-200 dark:bg-zinc-950`}>
            <nav>
                <Nav />
            </nav>
            <div className='w-full px-2 md:px-10 py-3 pb-5'>
                <Search />
                { children }
            </div>
        </main>
    </>
  )
}
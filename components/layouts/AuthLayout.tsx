import { ReactNode, useContext } from 'react';
import Head from 'next/head';
import { UiContext } from '@/context';
import { MoonIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

interface Props {
  children: ReactNode;
  title: string;
}

export const AuthLayout = ({ children, title  }:Props) => {
  const { theme, toggleTheme } = useContext(UiContext)
  return (
    <>
        <Head>
            <title>{ title }</title>
        </Head>

        <main className={`${ theme } w-full h-screen bg-white dark:bg-zinc-900`}>
          <button
              onClick={ toggleTheme }
              className="absolute top-5 right-5 mx-2 rounded-full bg-transparent p-1 dark:text-gray-400 text-black dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View cart</span>
              {
                  theme === "dark" ? <FontAwesomeIcon icon={faMoon} size='xl' className='text-white' /> : <FontAwesomeIcon icon={faSun} size='xl' className='text-black' />
              }
          </button>
          { children }
        </main>
    
    </>
  )
}
import { ReactNode, useContext } from 'react';
import Head from 'next/head';
import { UiContext } from '@/context';

interface Props {
  children: ReactNode;
  title: string;
}

export const AuthLayout = ({ children, title  }:Props) => {
  const { theme } = useContext(UiContext)
  return (
    <>
        <Head>
            <title>{ title }</title>
        </Head>

        <main className={`${ theme } w-full h-screen bg-white dark:bg-zinc-900`}>
          { children }
        </main>
    
    </>
  )
}
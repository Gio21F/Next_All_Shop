import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';

import { lightTheme, darkTheme } from '../themes';
import { AuthProvider, CartProvider, UiProvider } from '../context';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig 
        value={{
          fetcher: (...args: [key: string]) => fetch(...args).then(res => res.json())
        }}
      >
        <AuthProvider>
          <CartProvider>
            <UiProvider>
              <ThemeProvider theme={ lightTheme }>
                  <CssBaseline />
                  <Component {...pageProps} />
              </ThemeProvider>
            </UiProvider>
          </CartProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default MyApp
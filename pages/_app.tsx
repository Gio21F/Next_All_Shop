import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';

import { lightTheme, darkTheme } from '../themes';
import { AuthProvider, CartProvider, UiProvider } from '../context';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SnackbarProvider } from 'notistack';
import NextNProgress from "nextjs-progressbar";


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SnackbarProvider maxSnack={ 3 }>
        
        <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
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
                      <NextNProgress
                        color="#3A64D8"
                        startPosition={0.3}
                        stopDelayMs={200}
                        height={4}
                        showOnShallow={true}
                      />
                      <Component {...pageProps} />
                  </ThemeProvider>
                </UiProvider>
              </CartProvider>
            </AuthProvider>
          </SWRConfig>
        </PayPalScriptProvider>
      </SnackbarProvider>
    </SessionProvider>
  )
}

export default MyApp
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import { SWRConfig } from 'swr';
import { AuthProvider, CartProvider, UiProvider } from '../context';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SnackbarProvider } from 'notistack';
import NextNProgress from "nextjs-progressbar";


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SnackbarProvider maxSnack={ 3 }>
          <SWRConfig 
            value={{
              fetcher: (...args: [key: string]) => fetch(...args).then(res => res.json())
            }}
          >
            <AuthProvider>
              <CartProvider>
                <UiProvider>
                  <NextNProgress
                    color="#3A64D8"
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={4}
                    showOnShallow={true}
                  />
                  <Component {...pageProps} />
                </UiProvider>
              </CartProvider>
            </AuthProvider>
          </SWRConfig>
      </SnackbarProvider>
    </SessionProvider>
  )
}

export default MyApp
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {loadStripe} from '@stripe/stripe-js';
import { shopApi } from '@/api'
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
  } from '@stripe/react-stripe-js';
import { CartContext } from '@/context';
  
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SessionPage = () => {
    const [ error, setError ] = useState<{ error: boolean, message: string }>({ error: false, message: '' })
    const { cart } = useContext( CartContext );
    const fetchClientSecret = useCallback(async() => {
        if(cart.length === 0) {
            setError({ error: true, message: "No hay cart"});
            return;
        }
        const body = {
            products: cart.map((product) => ({
                id: product.id,
                quantity: product.quantity,
                size: product.size,
            }))
        }
        const { data, status } = await shopApi.post('/stripe', body)
        if(status !== 201) {
            setError({ error: true, message: 'No 200' })
        }
        return data.client_secret
    }, [])
    
    const options = {fetchClientSecret};

    if( error.error ) return (
        <div className='w-full h-screen bg-zinc-900 dark:bg-white text-black dark:text-white flex justify-center'>{ error.message }</div>
    )
    return (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}          
        >
          <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    )
}
export default SessionPage;

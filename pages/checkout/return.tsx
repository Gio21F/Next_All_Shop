import { shopApi } from '@/api';
import { ShopLayout } from '@/components/layouts';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Return = () => {
    const router = useRouter();
    const { session_id } = router.query;
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [ error, setError ] = useState<boolean>(false);
    useEffect(() => {
        async function checkSession(){
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const sessionId = urlParams.get('session_id');
                const { data } = await shopApi.get('/stripe/checkout_session?session_id=' + sessionId)
                setStatus(data.status)
                setCustomerEmail(data.customer_email);
            } catch (error) {
                setError(true)
            }
        }
        checkSession();
    }, []);
    
    return (
        <ShopLayout title='Stripe Return' pageDescription='Stripe payment return'>
            {
                status === "open" || error && (
                    <div className='flex h-screen w-full flex-col'>
                        <p className='dark:text-white text-black text-lg'> Algo salio mal, lo sentimos!! </p>
                    </div>
                )
            }
            {
                status === "complete" && (
                    <div className='flex h-screen w-full flex-col'>
                        <div className='flex justify-center'>
                            <img src="/success_payment.png" className='w-96 h-96' alt="Success" />
                        </div>
                        <p className='dark:text-white text-black text-lg text-center'>
                            We appreciate your business! A confirmation email will be sent to {customerEmail}.
                            If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                        </p>
                    </div>
                )
            }
        </ShopLayout>
    )
}

export default Return;

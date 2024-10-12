import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';

const SummaryPage = () => {

    const router = useRouter()
    const { shippingAddress, numberOfItems } = useContext( CartContext );

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        if ( !Cookies.get('firstName') ) {
            router.push('/checkout/address');
        }
    }, [ router ]);

    // const onCreateOrder = async() => {
    //     setIsPosting(true);
        
    //     const { hasError, message } = await createOrder(); 

    //     if ( hasError ) {
    //         setIsPosting(false);
    //         setErrorMessage( message );
    //         return;
    //     }

    //     router.replace(`/orders/${ message }`);
    // }

    if ( !shippingAddress ) {
        return <></>;
    }

    const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

  return (
    <ShopLayout autoHeight={true} title='Resumen de orden' pageDescription={'Resumen de la orden'}>

    {
        (numberOfItems === 0) 
            ? (
                <div className='flex justify-center flex-col w-full h-screen'>
                    <h5 className='dark:text-white text-xl text-center'>No se puede generar una orden sin productos. Agregue productos a su carrito</h5>
                    <Link href='/' passHref>
                        <p className='pt-4 text-indigo-600 text-2xl text-center'>
                            Regresar
                        </p>
                    </Link>
                </div>
                )
            : (
                <>
                    <h1 className='mb-5 font-semibold text-4xl text-black dark:text-white'>Resumen de la orden</h1>
                    <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 text-black dark:text-white'>
                        <div className='h-[400px] lg:h-[600px] overflow-y-auto'>
                            <CartList />
                        </div>
                        <div className='summary-card dark:shadow-sm dark:shadow-white/80 p-4 rounded-md lg:h-[470px] h-auto'>
                            <h2 className='text-3xl mb-2'>Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto':'productos' })</h2>
                            <hr />
                            <div className='flex justify-between my-2'>
                                <h3 className='text-md'>Dirección de entrega</h3>
                                <Link href='/checkout/address' passHref>
                                    <p className='text-indigo-600 underline'>Editar</p>
                                </Link>
                            </div>

                            <h3 className='text-md'>{ firstName } { lastName }</h3>
                            <h3 className='text-md'>{ address }{ address2 ? `, ${address2}` : ''  } </h3>
                            <h3 className='text-md'>{ city }, { zip }</h3>
                            {/* <Typography>{ countries.find( c => c.code === country )?.name }</Typography> */}
                            <h3 className='text-md'>{ country }</h3>
                            <h3 className='text-md mb-3'>{ phone }</h3>
                            <hr />
                            <OrderSummary />
                            <Link href='/checkout/session'>
                                <p className='my-5 p-2 rounded-full w-full flex justify-center text-white bg-indigo-600'>Proceder al pago</p>
                            </Link>
                            {/* <button
                                onClick={ handleCheckout }
                                className='my-5 p-2 rounded-full w-full bg-indigo-600' 
                                disabled={ isPosting }
                            >
                                Confirmar Orden
                            </button> */}
                        </div>
                    </div>
                </>
            )
    }
    </ShopLayout>
  )
}

export default SummaryPage;
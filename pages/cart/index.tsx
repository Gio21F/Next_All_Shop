import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';
import { CartContext } from '../../context';
import Link from 'next/link';

const CartPage = () => {
    const { numberOfItems, isLoaded, cart } = useContext( CartContext );
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty');
        }
    } , [isLoaded, cart, router]);

    if ( !isLoaded || cart.length === 0 ) return (<></>);

    return (
        <ShopLayout autoHeight={true} title={ `Carrito - ${numberOfItems}`} pageDescription={'Carrito de compras de la tienda'}>
            <h1 className='text-3xl font-bold pb-5 text-black dark:text-white'>Carrito</h1>
            <div className='h-full grid lg:grid-cols-2 grid-cols-1 gap-4 text-black dark:text-white'>
                {/* Products */}
                <div className='h-[400px] lg:h-[500px] overflow-y-auto'>
                    <CartList editable />
                </div>
                {/* Order */}
                <div className='summary-card dark:shadow-sm dark:shadow-white/80 p-4 rounded-md h-[270px]'>
                    <h4 className='text-md font-semibold mb-2 '>Orden</h4>
                    <hr />

                    <OrderSummary />

                    <div className='mt-5'>
                        <Link href='/checkout/address'>
                            <p className='w-full flex justify-center bg-indigo-700 p-2 rounded-full text-white' >Checkout</p>
                        </Link>
                    </div>
                </div>
            </div>
        </ShopLayout>
    )
}

export default CartPage;
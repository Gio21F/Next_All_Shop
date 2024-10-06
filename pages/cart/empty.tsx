import Link from 'next/link';
import { ShopLayout } from "../../components/layouts"
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';


const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito vació" pageDescription="No hay artículos en el carrito de compras">
         <div 
            className='flex justify-center pt-52 h-full'
        >
            <BuildingStorefrontIcon className='w-24 text-black dark:text-gray-300' />
            <div className='flex flex-col justify-center'>
                <h5 className='text-black dark:text-white'>Su carrito está vació</h5>
                <Link href='/' passHref>
                    <p className='text-indigo-600 text-4xl'>Regresar</p>
                </Link>
            </div>


        </div>
    </ShopLayout>
  )
}

export default EmptyPage
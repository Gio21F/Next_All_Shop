import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { useProducts } from '../hooks';
import { FullScreenLoading } from '../components/ui';

const Home: NextPage = () => {
  const { isError, isLoading, products } = useProducts(`${process.env.NEXT_PUBLIC_NEST_URL}/products`)
  return (
    <ShopLayout title={'All-Shop - Home'} pageDescription={'Encuentra los mejores productos de All shop aquí'}>
        <h1 className='font-semibold text-3xl text-black dark:text-white'>Tienda</h1>
        <h2 className='text-xl text-black dark:text-white'>Todos los productos</h2>
        <div className='w-full h-full mt-5'>
          {
            isLoading 
              ? <FullScreenLoading />
              : isError ? <h2 className='mt-2 w-32 flex justify-center bg-red-600 text-white p-2 rounded-full shadow-lg'>Algo salío mal</h2> : (
                <ProductList products={ products } />
              )
          }
        </div>
    </ShopLayout>
  )
  
  
}

export default Home

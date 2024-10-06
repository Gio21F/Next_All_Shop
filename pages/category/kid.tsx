import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

const KidPage: NextPage = () => {

  const { products, isLoading } = useProducts(`${process.env.NEXT_PUBLIC_NEST_URL}/products?gender=kid`);

  return (
    <ShopLayout title={'All-Shop - Kids'} pageDescription={'Encuentra los mejores productos de Teslo para niños'}>
      <h1 className='font-semibold text-3xl text-black dark:text-white'>Niños</h1>
      <h2 className='text-xl text-black dark:text-white'>Productos para niños</h2>
      <div className='w-full h-full mt-5'>
        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }
      </div>
    </ShopLayout>
  )
}

export default KidPage
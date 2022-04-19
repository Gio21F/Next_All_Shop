import type { NextPage } from 'next';
import { Typography } from '@mui/material';
// import { initialData } from '../database/products';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { useProducts } from '../hooks';
import { FullScreenLoading } from '../components/ui';

const Home: NextPage = () => {
  const { isError, isLoading, products } = useProducts('/products')
  return (
    <ShopLayout title={'All-Shop - Home'} pageDescription={'Encuentra los mejores productos de All shop aquí'}>
        <Typography variant='h1' component='h1'>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>
        {
          isLoading 
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }
    </ShopLayout>
  )
}

export default Home

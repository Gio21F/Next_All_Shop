import type { NextPage, GetServerSideProps } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { IProduct } from '../../interfaces';
import { shopApi } from '@/api';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}


const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout 
        title={'All-Shop - Search'} 
        pageDescription={'Encuentra los mejores productos de Teslo aquí'}
    >

        <div className='text-black dark:text-white'>
            <h1 className='text-3xl font-semibold'>Buscar productos</h1>
            {
                foundProducts 
                    ? <h2 className='text-xl flex mb-3'>Término: <p className='text-indigo-600 ml-2'>{ query }</p></h2>
                    : <h2 className='text-xl flex mb-3 lg:w-[600px] w-auto'>No encontramos ningun producto, pero aquí tienes otros productos que te pueden interesar!</h2>
            }
            <ProductList products={ products } />
        </div>
    </ShopLayout>
  )
}



// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    
    const { query = '' } = params as { query: string };

    if ( query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products: IProduct[];
    try {
        const { data } = await shopApi.get(`/products/search/${query}`);
        products = data;
    } catch (error) {
        products = [];
    }
    const foundProducts = products.length > 0;
    // TODO: retornar otros productos
    if ( !foundProducts ) {
        const response = await shopApi.get('/products/search/shirt');
        console.log(response);
        products = response.data
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}


export default SearchPage
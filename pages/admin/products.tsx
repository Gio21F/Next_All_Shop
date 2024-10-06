import Link from 'next/link';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts'
import { IProduct  } from '../../interfaces';
import { shopApi } from '@/api';
import { SyntheticEvent } from 'react';

const ProductsPage = () => {

    const fetcher = (url: string) => shopApi.get(url).then(res => res.data);
    const { data, error, isLoading } = useSWR<IProduct[]>(
        '/products/admin',
        fetcher
    );

    if(isLoading) return <>loading</>

    if ( !data && !error ) return (
        <AdminLayout 
        title={`Error`} 
        subTitle={'Algo salio mal'}
    ><></></AdminLayout>
    );
    
    const rows = data!.map( product => ({
        id: product.id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.stock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));


    return (
        <AdminLayout 
            title={`Productos (${ data?.length })`} 
            subTitle={'Mantenimiento de productos'}
        >
            <div className='flex justify-end mb-4'>
                <Link href="/admin/products/new">
                    <span className='bg-indigo-600 p-2 rounded-full text-white'>+ Crear producto</span>
                </Link>
            </div> 
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-[450px]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-950 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Imagen
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Titulo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Genero
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Inventario
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Precio
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tallas
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rows.map(product => (
                                    <tr className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <img 
                                                src={ product.img } 
                                                className='w-20 h-20 rounded-lg' 
                                                alt="Image" 
                                                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                                    (e.target as HTMLImageElement).src = '/noImage.jpg';
                                                }}
                                            />
                                        </th>
                                        <td className="px-6 py-4">
                                            { product.title }
                                        </td>
                                        <td className="px-6 py-4">
                                            { product.gender }
                                        </td>
                                        <td className="px-6 py-4">
                                            { product.inStock }
                                        </td>
                                        <td className="px-6 py-4">
                                            ${ product.price }
                                        </td>
                                        <td className="px-6 py-4">
                                            { product.sizes }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/products/edit/${product.slug}`} ><p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</p></Link>
                                        </td>
                                    </tr>
                                ))
                            }
                            
                        </tbody>
                </table>
            </div>         
        </AdminLayout>
    )
}

export default ProductsPage;
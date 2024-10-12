import Link from 'next/link';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts'
import { IOrder, IOrderItem } from '../../interfaces';
import { shopApi } from '@/api';
import { FullScreenLoading } from '@/components/ui';
import moment from 'moment';
import { capitalize } from '@/utils/capitalize';
import { useState } from 'react';

const ProductsPage = () => {

    const fetcher = (url: string) => shopApi.get(url).then(res => res.data);
    const { data, error, isLoading } = useSWR<IOrder[]>(
        '/orders/mine',
        fetcher
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ tempDetails, setTempDetails ] = useState<IOrderItem[]>([]);

    const toggleModal = (details?:IOrderItem[]) => {
        if(!isModalOpen && details) {
            setTempDetails(details);
        }
        setIsModalOpen(!isModalOpen);
    };

    if(isLoading) return (
        <AdminLayout
            title={`Solicitando...`} 
            subTitle={''}
        >
            <FullScreenLoading />
        </AdminLayout>
    )

    if ( !data && !error ) return (
        <AdminLayout
            title={`Error`} 
            subTitle={'Algo salio mal'}
        >
            <h2 className='mt-2 w-32 flex justify-center bg-red-600 text-white p-2 rounded-full shadow-lg'>Algo salío mal</h2>
        </AdminLayout>
    );
    
    const rows = data!.map( order => ({
        id: order.id,
        transaction_id: order.transaction_id,
        amount_subtotal: order.amount_subtotal,
        amount_total: order.amount_total,
        status: order.status,
        created_at: order.created_at,
        updated_at: order.updated_at,
        user: order.user,
        details: order.details
    }));


    return (
        <AdminLayout
            autoHeight={true}
            title={`Pedidos (${ data?.length })`} 
            subTitle={'Mis pedidos'}
        >
            {isModalOpen && (
                <ModalDetails productDetails={tempDetails} toggleModal={toggleModal} />
            )}
            <div className="relative overflow-x-auto rounded-md h-[550px]">
                <table className="w-full text-sm  shadow-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-950 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Estatus
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Subtotal
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Realizado
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Detalles</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rows.length === 0 && (
                                    <tr className='w-full flex p-5'>
                                        <th className='rounded-lg bg-red-500 p-2 text-white'>No tienes pedidos!</th>                                        
                                    </tr>
                                )
                            }
                            {
                                rows.map((order, i) => (
                                    <tr key={i} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { capitalize(order.status) }
                                        </th>
                                        <td className="px-6 py-4">
                                            <p className='font-semibold'>${ order.amount_subtotal } USD</p>
                                        </td>
                                        <td className="px-6 py-4">
                                        <p className='font-semibold'>${ order.amount_total } USD</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className='font-sans'>{ moment.utc(order.created_at).fromNow() }</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => toggleModal( order.details )} type='button'>
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Detalles</p>
                                            </button>
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


interface PropsDetails {
    productDetails: IOrderItem[];
    toggleModal: () => void;
}

const ModalDetails = ({ productDetails, toggleModal }:PropsDetails) => {
    return (
        <div tabIndex={-1} aria-hidden="false" className="flex items-center overflow-y-auto overflow-x-hidden absolute z-50 justify-center w-full md:inset-0 h-full max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-zinc-200 rounded-lg shadow dark:bg-zinc-900">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Detalles del pedido
                        </h3>
                        <button onClick={toggleModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 relative overflow-x-auto shadow-md sm:rounded-lg h-[400px]">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-950 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Imágen
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Título
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Cantidad
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Talla
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        productDetails.map((productDetail, i) => (
                                            <tr key={i} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {
                                                        productDetail.product.imageUrls && productDetail.product.imageUrls.length > 0 ? (
                                                            <img 
                                                                src={ productDetail.product.imageUrls[0] } 
                                                                alt="Img"
                                                                className='min-w-16 w-16 min-h-16 h-16 rounded-lg object-cover' 
                                                            />
                                                        ) : (
                                                            <img 
                                                                src="./noImage.jpg" 
                                                                className='min-w-16 w-16 min-h-16 h-16 rounded-lg object-cover' 
                                                                alt="Image" 
                                                            />
                                                        )
                                                    }
                                                </th>
                                                <td className="px-6 py-4">
                                                    <Link href={`/product/${productDetail.product.slug}`}>
                                                        <p className='font-semibold opacity-80 hover:opacity-100'>{ productDetail.product.title }</p>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className='font-semibold'>{ productDetail.quantity }</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                <p className='font-semibold'>{ productDetail.size }</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className='font-sans'>${ productDetail.subtotal } USD</p>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    
                                </tbody>
                        </table>
                    </div>   
                </div>
            </div>
        </div>
    )
}
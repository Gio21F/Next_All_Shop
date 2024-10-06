import { FC, useContext } from 'react';
import Link from 'next/link';

import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';


interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product );
    }

    const productsToShow = products ? products : cart;


    return (
        <>
            {
                productsToShow.map( product => (
                    <div className='grid lg:grid-cols-2 grid-cols-2 gap-3 mb-4' key={ product.slug + product.size }>
                        <div className='grid'>
                            {/* TODO: llevar a la página del producto */}
                            <Link href={`/product/${ product.slug }`} passHref>
                                <img src={product.image} alt="Product image" />
                            </Link>
                        </div>
                        <div className='grid'>
                            <div className='flex flex-col'>
                                <h4 className='text-md font-semibold'>{ product.title }</h4>
                                <h4 className='text-md'>Talla: <strong>{ product.size }</strong></h4>
                                <h4 className='text-md'>Precio: <strong>{ `$${ product.price }` }</strong></h4>
                                {
                                    editable 
                                    ? (
                                        <ItemCounter 
                                            currentValue={ product.quantity }
                                            maxValue={ 10 } 
                                            updatedQuantity={ ( value ) => onNewCartQuantityValue(product as ICartProduct, value )}
                                        />
                                    )
                                    : (
                                        <h4 className='text-md'>{ product.quantity } { product.quantity > 1 ? 'productos':'producto' }</h4>
                                    )
                                }
                                {
                                editable && (
                                    <button 
                                        className='text-indigo-400 text-sm font-semibold flex'
                                        onClick={ () => removeCartProduct( product as ICartProduct ) }
                                    >
                                        Remover
                                    </button>
                                )
                            }
                            </div>
                        </div>
                        
                    </div>
                ))
            }
        </>
    )
}
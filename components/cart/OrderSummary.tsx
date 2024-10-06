import { FC, useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { currency } from '../../utils';


interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        total: number;
        tax: number;
    }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
    
    const { numberOfItems, subTotal, total, tax } = useContext( CartContext );
    
    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, tax };
  
  return (
    <div className='flex flex-col mt-2'>
        
        <div className='flex justify-between'>
            <p className='text-md'>No. Productos</p>
            <p className='text-md'>{summaryValues.numberOfItems} { summaryValues.numberOfItems > 1 ? 'productos': 'producto' }</p>
        </div>

        <div className='flex justify-between'>
            <p className='text-md'>SubTotal</p>
            <p className='text-md'>{ currency.format(summaryValues.subTotal) }</p>
        </div>

        <div className='flex justify-between'>
            <p className='text-md'>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</p>
            <p className='text-md'>{ currency.format(summaryValues.tax) }</p>
        </div>

        <div className='flex justify-between mt-2'>
            <p className='text-md font-semibold'>Total:</p>
            <p className='text-md font-semibold'>{ currency.format(summaryValues.total) }</p>
        </div>
    </div>
  )
}
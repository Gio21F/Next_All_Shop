import { IProduct } from '../../interfaces'
import { ProductCard } from '.'

interface Props {
    products: IProduct[];
}

export const ProductList = ({ products }:Props) => {
  return (
        <div className='pb-5 h-max[500px] h-[500px] scrollbar-custom overflow-hidden overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-7'>
            {
                products.map( product => (
                    <ProductCard 
                        key={ product.slug }
                        product={ product }
                    />
                ))
            }
        </div>
  )
}
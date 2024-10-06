import { useState, useContext } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/cart/CartContext';

import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow } from '../../components/products';
import { ItemCounter } from '../../components/ui/ItemCounter';

import { IProduct, ICartProduct, ISize } from '../../interfaces';

import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { shopApi } from '@/api';


interface Props {
  product: IProduct
}

const ProductPage:NextPage<Props> = ({ product }) => {

  const router = useRouter();
  const { addProductToCart } = useContext( CartContext )
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    id: product.id!,
    image: product.images.length !== 0 ? product.images[0] : './noImage.jpg',
    price: product.price,
    size: product.sizes[0],
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const handleSizeChange = (value:ISize) => {
    setTempCartProduct({
      ...tempCartProduct,
      size: value,
    });
  };

  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }));
  }

  const onAddProduct = () => {

    if ( !tempCartProduct.size ) { return; }

    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  const reviews = { href: '#', average: 4, totalCount: 117 }
  
  function classNames(...classes:any[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <ShopLayout autoHeight={true} title={ product.title } pageDescription={ product.description }>
      <div className="bg-transparent h-full">
        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-7 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl">{product.title}</h1>
          </div>

          {/* Col 1 */}
          <div className="ml-2 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <ProductSlideshow 
              images={ product.images }
            />
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-black dark:text-white">{product.description}</p>
              </div>
            </div>
          </div>
          
          {/* col 2 */}
          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-black dark:text-white">{`$${product.price} USD`}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        reviews.average > rating ? 'text-black dark:text-white' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <div className="mt-10">
              {/* Counter */}
              <ItemCounter 
                currentValue={tempCartProduct.quantity} 
                maxValue={ product.stock > 10 ? 10: product.stock } 
                updatedQuantity={ onUpdateQuantity  }
              />
              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-black dark:text-white">Size</h3>
                </div>

                <fieldset aria-label="Choose a size" className="mt-4">
                  <RadioGroup
                    value={tempCartProduct.size}
                    onChange={handleSizeChange}
                    className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                  >
                    {product.sizes.map((size, i) => (
                      <Radio
                        key={i}
                        value={size}
                        className={classNames(
                          tempCartProduct.size == size ? 'ring-4 ring-indigo-500' : '',
                          'cursor-pointer bg-white text-gray-900 shadow-sm',  
                          'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 sm:flex-1 sm:py-6',
                        )}
                      >
                        <span>{size}</span>
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>
              
              {/* Agregar al carrito */}
          {
            (product.stock > 0)
              ? (
                  <button
                    type="submit"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={ onAddProduct }
                  >
                    {
                      tempCartProduct.size
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                  </button>
              )
              : (
                <p className='text-red-700 mt-10'>No hay disponibles</p>
              )
            }
            </div>
          </div>
        </div>
    </div>

    </ShopLayout>
  )
}


// getServerSideProps 
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* No usar esto.... SSR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug( slug );

  // if ( !product ) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false
  //     }
  //   }
  // }

//   return {
//     props: {
//       product
//     }
//   }
// }


// getStaticPaths....
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const { data } = await shopApi.get('/products/admin')

  return {
    paths: data.map( ({ slug }:IProduct) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  
  const { slug = '' } = params as { slug: string };
  const { data: product } = await shopApi.get('/products/'+ slug )

  if ( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product: product
    },
    revalidate: 60 * 60 * 24
  }
}



export default ProductPage
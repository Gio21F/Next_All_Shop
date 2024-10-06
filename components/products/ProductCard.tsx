import { FC, SyntheticEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { IProduct } from '../../interfaces'

interface Props {
    product: IProduct;
}

export const ProductCard = ({ product }:Props) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [ errorImage, setErrorImage ] = useState(false);
    const existImages = product.images.length > 0;

    const productImage = useMemo(() => {
        if (product.images.length === 0) {
            return './noImage.jpg'; // No hay imágenes
        } else if (product.images.length === 1) {
            return product.images[0]; // Solo una imagen
        } else {
            return isHovered ? product.images[1] : product.images[0]; // Más de una imagen
        }
    }, [isHovered, product.images])
    return (
      <div
        className='shadow-md dark:shadow-white/15 rounded-lg h-[350px]'
        onMouseEnter={ () => setIsHovered(true) } 
        onMouseLeave={ () => setIsHovered(false) }
      >
            <div>
                <Link href={`/product/${product.slug}`} passHref prefetch={ false }>
                    <div className='relative'>
                        {
                            product.stock === 0 && (
                                <div className='p-2 rounded-full text-white bg-black z-10 absolute top-2 left-2'>
                                    <p>No hay disponibles</p>
                                </div>
                            )
                        }
                        <img   
                            className='fadeIn rounded-tl-lg rounded-tr-lg w-full h-72 object-cover'
                            src={productImage}
                            alt={ product.title }
                            onLoad={ () => {
                                setIsImageLoaded(true);
                                setErrorImage(false);
                            }}
                            onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                if (!errorImage) { // Verifica que no haya un error de imagen anterior
                                    setErrorImage(true);
                                    (e.target as HTMLImageElement).src = '/noImage.jpg';
                                }
                            }}
                        />
                    </div>
                </Link>
            </div>

        <div style={{ display: isImageLoaded ? 'block' : 'none' }} className='fadeIn flex flex-col px-3 py-2'>
            <p className='font-semibold text-md text-black dark:text-white truncate'>{ product.title }</p>
            <p className='text-md text-black dark:text-white'>{ `$${product.price}` }</p>
        </div>
        </div>
    )
}
import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css';
import { useEffect, useState } from 'react';

interface Props {
    images: string[]
}

export const ProductSlideshow = ({ images }:Props) => {
    const [slidesImages, setSlidesImages] = useState<string[]>([]);

    useEffect(() => {
        // Asignar la imagen por defecto solo en el cliente
        if (images.length === 0) {
            setSlidesImages([`${window.location.origin}/noImage.jpg`]);
        } else {
            setSlidesImages(images);
        }
    }, [images]);
    return (
        <Slide
            easing="ease"
            duration={ 7000 }
            indicators
        >
            {
                slidesImages.map( image =>  {
                    return (
                        <div className={ styles['each-slide'] } key={ image }>
                            <div style={{
                                backgroundImage: `url(${ image })`,
                                backgroundSize: 'cover',
                                
                            }}>
                            </div>
                        </div>
                    )

                })
            }

        </Slide>
    )
}
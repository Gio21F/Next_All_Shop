import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';


import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';

type Data = 
| { message: string }
| IProduct[]
| IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res );
            
        case 'PUT':
            return updateProduct( req, res );

        case 'POST':
            return createProduct( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
 
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

    await db.disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image }`
        });

        return product;
    })


    res.status(200).json( updatedProducts );

}

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    res.status(200).json({ message: 'update' });
}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    res.status(200).json({ message: 'create' });
}

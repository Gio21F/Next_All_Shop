import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database';
import { Product, User } from '../../models';

type Data = { message: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (  process.env.NODE_ENV === 'production'){
        return res.status(401).json({ message: 'No tiene acceso a este API'});
    }
    try {
        await db.connect();
        await User.deleteMany();
        await User.insertMany( seedDatabase.initialData.users );
        await Product.deleteMany();
        await Product.insertMany( seedDatabase.initialData.products );
        await db.disconnect();
    } catch (error) {
        res.status(500).json({ message: 'Algo salio mal' });
    }


    res.status(200).json({ message: 'Proceso realizado correctamente' });
}
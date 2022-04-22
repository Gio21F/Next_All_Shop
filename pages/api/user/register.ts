import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data = 
    | {message: string}
    | {
        token: string,
        user: {
            email: string,
            role: string,
            name: string
        }
    }


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser(req, res);
    
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body;
    
    if (password.length < 6) {
        return res.status(401).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    if (name.length < 3) {
        return res.status(401).json({ message: 'El nombre debe tener al menos 3 caracteres' });
    }
    if (!validations.isValidEmail(email)) {
        return res.status(401).json({ message: 'El correo no parece ser válido' });
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
    });

    try {
        await db.connect();
        const user = await User.findOne({ email });
        if (user) {
            await db.disconnect();
            return res.status(401).json({ message: 'Correo ya registrado' });
        }
        await newUser.save({ validateBeforeSave: true });
        await db.disconnect();
    } catch (error) {
        await db.disconnect();
        return res.status(500).json({ message: 'Error al registrar usuario' });
    }

    const { _id, role } = newUser;
    const token = jwt.signToken(_id, role);
    
    return res.status(200).json({
        token,
        user: {
            email,
            role,
            name
        }
    });
}
import { FC, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'

import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

import { AuthContext, authReducer } from './';
import { shopApi } from '../../api';
import { IUser } from '../../interfaces';
import axiosInstance from '../../utils/axios';

interface Props {
    children: ReactNode
}
export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            if(data.user?.token){
                localStorage.setItem('token', data.user.token);
                dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
            }
            else {
                dispatch({ type: '[Auth] - Logout' })
            }
        }
    }, [data, status]);

    // Basar en autenticación personalizada
    // useEffect(() => {
    //     checkToken();
    // }, [])

    const checkToken = async() => {
        console.log('Checking token');
        if ( !Cookies.get('token') ) return;
        try {
            const { data } = await axiosInstance.get('/auth/check-status');
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }

    const loginUser = async( email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {

        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            const { user } = data;
            // Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
            return { hasError: false }
        } catch (error: any ) {
            if (error.response.status === 400){
                return { hasError: true, message: error.response.data.message[0] };
            }
            return { hasError: true, message: error.response.data.message};
        }

    }

    const registerUser = async( fullname: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axiosInstance.post('/auth/register', { fullname, email, password });
            const { token, user } = data;
            // Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstName')
        Cookies.remove('lastName')
        Cookies.remove('address')
        Cookies.remove('address2')
        Cookies.remove('zip')
        Cookies.remove('city')
        Cookies.remove('country')
        Cookies.remove('phone')
        signOut();
        localStorage.removeItem('token');
        dispatch({ type: '[Auth] - Logout' });
        // Para nuestra autenticacion personalizada
        // Cookies.remove('token');
        // router.reload();

    }

    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logout

        }}>
            { children }
        </AuthContext.Provider>
    )
};
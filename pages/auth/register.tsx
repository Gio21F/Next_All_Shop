import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { FullScreenLoading } from '@/components/ui';
import { shopApi } from '@/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


type FormData = {
    fullName    : string;
    email   : string;
    password: string;
};


const RegisterPage = () => {

    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState<string|''>();
    const { isLoggedIn, registerUser, user } = useContext(AuthContext);
    // const { data: session, status } = useSession();

    // useEffect(() => {
    //     if (status === 'loading') return;
    //     if (session?.user) {
    //         let destination = '/';
    //         if (router.query.callbackUrl) {
    //             const callbackUrl = router.query.callbackUrl as string;
    //             const url = new URL(callbackUrl);
    //             destination = url.pathname + url.search;
    //         }
    //         else if (router.query.p) {
    //             destination = router.query.p as string;
    //         }
    //         router.push(destination);
    //     }
    // }, [session, status]);

    // if (status === 'loading' || session?.user) return (
    //     <AuthLayout title='Registro'>
    //         <FullScreenLoading />
    //     </AuthLayout>
    // )

    useEffect(() => {
        if (isLoggedIn && user) {
            let destination = '/';
            if (router.query.callbackUrl) {
                const callbackUrl = router.query.callbackUrl as string;
                const url = new URL(callbackUrl);
                destination = url.pathname + url.search;
            }
            else if (router.query.p) {
                destination = router.query.p as string;
            }
            router.push(destination);
        }
    }, [ isLoggedIn, user ])

    const onRegisterForm = async( form: FormData ) => {
        setShowError(false);
        setIsFetching(true);
        const { hasError, message } = await registerUser( form.fullName, form.email, form.password );
        if(hasError) {
            setShowError(true)
            setErrorMessage(message);
            setTimeout(() => setShowError(false), 5000 )
            setIsFetching(false)
            return;
        }
        // try {
        //     const { data, status } = await shopApi.post('/auth/register', form)
        //     if ( status == 201 ){
        //         signIn('credentials', { email: data.email, password: form.password, redirect: false })
        //             .then((response:any) => {
        //                 if(response.status !== 200){
        //                     setShowError(true)
        //                     setTimeout(() => setShowError(false), 3000 )
        //                 }
        //             });
        //     }
        // } catch (error) {
        //     setShowError(true);
        //     setIsFetching(false)
        //     console.log(error)
        //     setErrorMessage( 'Usuario ya registrado');
        //     setTimeout(() => setShowError(false), 3000);
        //     return;
        // }
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm dark:text-white text-black">
                    <Link href="/" className='flex justify-center'>
                        <img src="/shop.webp" className='w-32 h-32 object-cover' alt="Logo" />
                    </Link>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className='space-y-2' onSubmit={ handleSubmit(onRegisterForm) }>
                        <div>
                            {showError && (
                                <p className='p-4 my-2 rounded-md bg-red-600 text-cyan-50'>{ errorMessage }</p>
                            )}
                            <label htmlFor="email" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                                Nombre completo
                            </label>
                            <div className="mt-2">
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    autoComplete="fullName"
                                    className="block p-4 w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-transparent dark:text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    { ...register('fullName', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                    })}
                                />
                                {errors.fullName && <p>{errors.fullName.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block p-4 w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-transparent dark:text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    { ...register('email', {
                                        required: 'Este campo es requerido',
                                        validate: validations.isEmail
                                    })}
                                />
                                {errors.email && <p>{errors.email.message}</p>}
                            </div>      
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                                Contraseña
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block p-4 w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-transparent dark:text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    { ...register('password', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                    })}
                                />
                                {errors.password && <p>{errors.password.message}</p>}
                            </div>
                        </div>                            
                        
                        <div className="flex items-center justify-between">
                            <div className="text-sm my-2">
                                <Link href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login' } className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    ¿Ya tienes cuenta?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={ isFetching }
                                className="disabled:opacity-70 w-full content-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >

                                {
                                    isFetching ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="fa-fw mx-2 animate-spin" />
                                            Registrarse
                                        </>
                                    ) : (<>Registrarse</>)
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    )
}

export default RegisterPage
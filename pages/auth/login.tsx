import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { AuthContext } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FullScreenLoading } from '@/components/ui';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


type FormData = {
    email   : string,
    password: string,
};


const LoginPage = () => {

    const router = useRouter();
    const { loginUser, user, isLoggedIn } = useContext( AuthContext );
    const [ showError, setShowError ] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ isFetching, setIsFetching ] = useState(false);
    const { data: session, status } = useSession();
    // useEffect(() => {
    //     if (isLoggedIn) {
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
    // })

    useEffect(() => {
        if (status === 'loading') return;
        if (session?.user) {
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
    }, [session, status]);

    
    if (status === 'loading' || session?.user) return (
        <AuthLayout title='Inicio de sessión'>
            <FullScreenLoading />
        </AuthLayout>
    )

    const onLoginUser = async( { email, password }: FormData ) => {
        setIsFetching(true);
        signIn('credentials', { email, password, redirect: false })
            .then((response:any) => {
                if(response.status !== 200){
                    setShowError(true)
                    setTimeout(() => setShowError(false), 3000 )
                }
            }).catch((error) => {
                console.log(error)
                setIsFetching(false)
            })
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm dark:text-white text-black">
                    <Link href="/" className='flex justify-center'>
                        <img src="/shop.webp" className='w-32 h-32 object-cover' alt="Logo" />
                    </Link>
                    {/* <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
                        Iniciar sessión
                    </h2> */}
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onLoginUser)} className="space-y-4">
                        <div>
                            {showError && (
                                <p className='p-4 my-2 rounded-md bg-red-600 text-cyan-50'>Error de credenciales</p>
                            )}
                            <label htmlFor="email" className="block text-sm font-medium leading-6 dark:text-white text-black">
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 dark:text-white text-black">
                                    Contraseña
                                </label>
                                {/* <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>
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
                            <div className="text-sm">
                                <Link href={ router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/login' } className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    ¿Aún no tienes una cuenta?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={ isFetching }
                                className="disabled:opacity-70 w-full content-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {
                                    isFetching ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="fa-fw mx-2 animate-spin" />
                                            Iniciar sessión
                                        </>
                                    ) : (<>Iniciar sessión</>)
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

//     const session = await getSession({req})
//     const { p = '/'} = query 
//     if ( session ) {
//         return {
//             redirect: {
//                 destination: p.toString(),
//                 permanent: false,
//             }
//         }
//     }

//     return {
//         props: {}
//     }
// }

export default LoginPage
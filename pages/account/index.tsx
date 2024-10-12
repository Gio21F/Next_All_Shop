import { ShopLayout } from '@/components/layouts'
import { FullScreenLoading } from '@/components/ui'
import { AuthContext } from '@/context'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

const Account = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session?.user) {
            router.push('/');
        }
    }, [session, status]);

    if (status === 'loading') return (
        <ShopLayout title='Cuenta' pageDescription=''>
            <FullScreenLoading />
        </ShopLayout>
    )
    return (
        <ShopLayout title='Cuenta' pageDescription=''>
            <div className='p-4 pt-14 space-y-5 flex flex-col w-full'>
                <div className='p-4 rounded-lg w-[600px] w-min-[200px] bg-white dark:bg-zinc-800'>
                    <div className="flex items-center gap-4">
                        <img className="w-16 h-16 rounded-full" src={ session?.user.avatar } alt="Img" />
                        <div className="font-medium dark:text-white">
                            <div>{ session?.user.fullName }</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Creado: {moment.utc(session?.user?.created_at).fromNow()}</div>
                        </div>
                    </div>
                </div>
                <div className='p-4 rounded-lg w-[600px] w-min-[200px] bg-white dark:bg-zinc-800'>
                    Información
                    <form>
                        
                    </form>               
                </div>
            </div>
        </ShopLayout>
    )
}

export default Account;
